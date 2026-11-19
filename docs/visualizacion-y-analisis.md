# Visualización y análisis

La sección `/visualizacion-y-analisis` es el tablero de ARCA VIVO, desarrollado por Angela Milena
Ortiz Torres como un HTML independiente (D3 + API de ARCA). El sitio lo sirve como página propia, con
el menú de ARCA, sin iframe.

---

## 1. Cómo funciona

```
navegador ──► /visualizacion-y-analisis ──► server/routes/visualizacion-y-analisis.get.ts
                                              │ lee server/assets/visualizacion-y-analisis.html
                                              │ y le inserta:
                                              │   · título, descripción, canonical (SEO)
                                              │   · la barra de menú del sitio
                                              │   · ajustes de CSS (posiciones bajo la barra,
                                              │     carga discreta, encabezado más compacto)
                                              │   · un script que envía sus consultas GraphQL
                                              │     a la copia del servidor
                                              ▼
                               el tablero corre en el navegador
                                              │ POST https://apiarca…/graphql
                                              ▼ (redirigido a)
                               /datos-viz/graphql ──► copia en el servidor (caché)
                                                       └─► API de ARCA si no está en caché
```

**El archivo HTML no se modifica:** todos los ajustes se hacen al servirlo. Así se puede reemplazar
por una versión nueva sin tocar el resto.

### Archivos

| Archivo                                         | Qué hace                                                      |
| ----------------------------------------------- | ------------------------------------------------------------- |
| `server/assets/visualizacion-y-analisis.html`   | El tablero (copia de `index_comparar.html` de ARCA VIVO)      |
| `server/routes/visualizacion-y-analisis.get.ts` | Sirve la página con menú, SEO, estilos y redirección de datos |
| `server/routes/datos-viz/graphql.post.ts`       | Punto de entrada de la copia de datos                         |
| `server/utils/copiaViz.ts`                      | Caché de las consultas (6 h, se renueva en segundo plano)     |
| `server/plugins/precargaViz.ts`                 | Renueva las consultas conocidas cada 5 horas                  |
| `utilidades/menu.ts`                            | Menú que se inserta en la barra                               |

---

## 2. Copia de datos en el servidor

El tablero, al abrirse, pide los totales, la geografía y las 27.000 obras en bloques de 1.000. El API
responde lento y marca sus respuestas como no guardables (`Cache-Control: no-cache`).

- Cada consulta GraphQL del tablero pasa por `/datos-viz/graphql`, que guarda la respuesta
  (`defineCachedFunction`, clave = huella SHA-1 de la consulta).
- La respuesta se considera fresca 6 horas; después se entrega la guardada y se renueva por detrás
  (`swr`). **Medido:** 0,66 s directo al API y 0,004 s desde la copia.
- Las consultas vistas se recuerdan (`useStorage('data')`, clave `viz:consultas`, máx. 80) y el plugin
  `precargaViz` las renueva cada 5 horas, de a una, para que la copia esté lista antes de que alguien
  abra la página.
- **Seguridad:** solo consultas de lectura (se rechazan `mutation`), de hasta 20.000 caracteres. Los
  errores del API no se guardan.
- **Respaldo:** si la copia falla, el script de la página repite la consulta directo contra el API.

### Almacenamiento (`nuxt.config.ts`)

```ts
nitro: {
  storage: {
    cache: { driver: 'fs', base: './.data/cache' },
    data:  { driver: 'fs', base: './.data/kv' },
  },
}
```

- La carpeta `.data/` se crea junto al proyecto, ocupa unos 50 MB y sobrevive a reinicios. Está en
  `.gitignore`.
- **El usuario que corre el servidor necesita permiso de escritura** en esa carpeta.
- Con pm2 en modo clúster (`ecosystem.config.js`), todas las instancias comparten `.data/` y solo la
  instancia 0 ejecuta la renovación periódica.
- Para vaciar la copia: detener el servidor y borrar `.data/cache/`.

---

## 3. Ajustes de presentación que se hacen al servir

- Se oculta a la vista (no a lectores de pantalla) el título «ARCA Arte Colonial Americano» del
  tablero, que se repetía con el menú.
- «27.000 obras» va a la izquierda, en el mismo renglón que «Conectado a…».
- **Carga discreta:** en vez de la pantalla completa, una barra fina bajo el menú y un aviso pequeño.
- Los elementos fijos del tablero (panel de filtros, encabezado pegajoso, explorador) empiezan debajo
  de la barra de 72 px.

---

## 4. Actualizar el tablero

1. Copiar la versión nueva de `index_comparar.html` (repositorio ARCA VIVO) sobre
   `server/assets/visualizacion-y-analisis.html`.
2. Si cambiaron las clases o ids que se ajustan (`header.cabeza`, `.conexion`, `.carga`,
   `.panel-filtros`, `.explorador`), revisar los estilos en `visualizacion-y-analisis.get.ts`.
3. `yarn build` y reiniciar. Las consultas nuevas se guardan solas la primera vez que se piden.

`server/assets` está excluido de Prettier (`.prettierignore`) para conservar el archivo tal cual.

## Colores de las gráficas (accesibilidad)

Debajo de las pestañas hay un selector **«Colores de las gráficas»** con cuatro paletas:

| Paleta                   | Uso                                                                                                                          |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| **ARCA**                 | La paleta original del proyecto.                                                                                             |
| **Escala de grises**     | Grises bien separados en luminosidad; además, cualquier color fijo de una gráfica se pasa a gris con `filter: grayscale(1)`. |
| **Apta para daltonismo** | Paleta Okabe-Ito para categorías y rampa _cividis_ para cantidades.                                                          |
| **Alto contraste**       | Tonos saturados y rampa _inferno_ (de claro a casi negro).                                                                   |

- Está implementado en `index_comparar.html` (copiado en `server/assets/visualizacion-y-analisis.html`): objeto `PALETAS` y función `aplicarPaleta()`. Al cambiar de paleta se redibujan todas las gráficas con `aplicarFiltros()`.
- La elección se guarda en `localStorage` (`arca.paleta`). También se puede abrir con `?paleta=arca|grises|daltonismo|contraste` en la URL.
- En las rampas de cantidad, más obras siempre se ve más oscuro.
- Es independiente del botón **Contraste** del encabezado, que cambia los fondos y el texto de todo el sitio.
