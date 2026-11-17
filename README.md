# Sitio principal de ARCA

![Estilos Código](https://github.com/enflujo/arca-www/actions/workflows/estilo-codigo.yml/badge.svg)
![Despliegue](https://github.com/enflujo/arca-www/actions/workflows/despliegue.yml/badge.svg)

Sitio web de **ARCA · Arte Colonial Americano** ([arca.uniandes.edu.co](https://arca.uniandes.edu.co)),
base de datos de 27.000 pinturas producidas en las Américas entre 1530 y 1830.

Creado con [Nuxt 4](https://nuxt.com) (Vue con _Server-Side Rendering_). Los contenidos vienen del CMS
[Directus](https://directus.io) del proyecto (`apiarca.uniandes.edu.co`) y la búsqueda usa
[Meilisearch](https://www.meilisearch.com).

## Documentación

| Documento                                                            | Contenido                                                             |
| -------------------------------------------------------------------- | --------------------------------------------------------------------- |
| [docs/rediseno-2026.md](docs/rediseno-2026.md)                       | Lenguaje visual, navegación, plantillas y cómo está hecha cada página |
| [docs/seo.md](docs/seo.md)                                           | Cómo se indexan el sitio y las obras, y qué hacer fuera del código    |
| [docs/visualizacion-y-analisis.md](docs/visualizacion-y-analisis.md) | Integración del tablero de visualización y su copia de datos          |
| [docs/redirecciones-arcav1.md](docs/redirecciones-arcav1.md)         | Redirecciones desde la versión anterior (arcav1)                      |

## Requisitos

- [Node.js](https://nodejs.org) 20 o superior (LTS recomendada).
- Yarn 4 (definido en `package.json`). Se activa con Corepack, que viene con Node:

```bash
corepack enable
```

## Instalación

```bash
yarn install
```

## Desarrollo local

Hay dos formas de correr el sitio en un computador.

### A. Modo desarrollo (con API local)

```bash
yarn dev
```

Abre [localhost:3000](http://localhost:3000) con recarga automática. **En este modo el sitio busca el
API en `http://localhost:8055` y el buscador en `http://localhost:7700`** (ver `config/general.ts`),
así que se necesita una copia local de Directus y Meilisearch. Sin ellos, las páginas responden con
error 500.

### B. Versión de producción contra el API público

Para ver y probar el sitio con los datos reales sin instalar el API:

```bash
yarn build
node .output/server/index.mjs
```

Abre [localhost:3000](http://localhost:3000) (o el puerto de la variable `PORT`). Usa
`apiarca.uniandes.edu.co`. No tiene recarga automática: después de cada cambio hay que volver a
compilar.

Las copias del sitio que no estén en `arca.uniandes.edu.co` responden a los buscadores con «no
indexar», así que las pruebas no generan contenido duplicado en Google.

## Estructura

```
assets/scss/        Variables de diseño (_constantes.scss) y estilos base (_normalizar.scss)
cerebros/           Estado global (Pinia): datos generales del sitio y del archivo
components/         Componentes Vue
  Paginas/            Plantillas de Sobre ARCA, ARCA 2016–2022 y Recursos
  Registro/           Campos de la ficha de obra y mapa del recorrido (MapaObra.vue)
  Vista/              Índices de la Colección (A–Z, por cantidad, mapa)
  Galeria/            Galerías de obras
composables/        obtenerDatos (servidor), obtenerDatosAsinc, elementosCabeza (SEO)
config/general.ts   URL del API, del buscador y del sitio
docs/               Documentación del proyecto
layouts/            default, archivo (con menú lateral) y paginas
paginas/            Rutas: index (Home), obras/[registro], categorias, [...slug]
public/             Archivos estáticos (robots.txt, íconos)
server/
  assets/           Tablero de Visualización y análisis (HTML)
  middleware/       Redirecciones de arcav1 y «noindex» para copias
  plugins/          Renovación periódica de la copia de datos de la visualización
  routes/           sitemap, imágenes con nombre descriptivo, visualización y su copia de datos
  utils/            Funciones del servidor (sitemap, copia de datos)
utilidades/         menu.ts (navegación), seo.ts, contenidoCMS.ts, ayudas.ts
```

## Contenido: qué se edita en el CMS y qué en el código

| Contenido                                                     | Dónde se edita                                     |
| ------------------------------------------------------------- | -------------------------------------------------- |
| Obras, autores, categorías y demás colecciones                | CMS (Directus)                                     |
| Descripciones de las páginas de la Colección                  | CMS (`paginas_archivo`)                            |
| Menú lateral de la Colección                                  | CMS (`paginas_archivo.mostrar_en_menu`)            |
| Imágenes de Sobre ARCA y Recursos, bibliografía               | CMS (`paginas`)                                    |
| Texto «Arte Colonial Americano (ARCA)» del Home               | CMS (`paginas` › `sobre-arca` › `secciones`)       |
| Menú principal (5 entradas) y submenús de Recursos/Sobre ARCA | Código: `utilidades/menu.ts`                       |
| Textos del Home y de Sobre ARCA / Recursos                    | Código: `paginas/index.vue`, `components/Paginas/` |
| Créditos del pie de página                                    | Código: `components/Guardaescobas.vue`             |

Más detalle en [docs/rediseno-2026.md](docs/rediseno-2026.md).

## Reglas de estilo del código

Para ver los errores de estilo:

```bash
yarn lint
```

**¡IMPORTANTE!** - Antes de hacer push o PR, aplicar las reglas al código:

```bash
yarn lint:fix
```

## Despliegue al servidor

GitHub Actions (`.github/workflows/despliegue.yml`) actualiza el código, compila y reinicia el
servidor con pm2 cuando se actualiza `main`. Para saltarse el despliegue, incluir `[skip ci]` en el
mensaje del commit.

En el servidor, el sitio corre con pm2 (`ecosystem.config.js`) en modo clúster, puerto 4043.

**Requisitos del servidor desde el rediseño 2026:**

- **Permiso de escritura en `.data/`** (junto al proyecto). Ahí se guardan las cachés del sitemap, de
  las imágenes por registro y de la copia de datos de la visualización (unos 50 MB). La carpeta se crea
  sola y está en `.gitignore`.
- Para que funcionen las redirecciones desde la versión anterior, el dominio `arcav1.uniandes.edu.co`
  debe llegar a este mismo servidor conservando la cabecera `Host` (ver
  [docs/redirecciones-arcav1.md](docs/redirecciones-arcav1.md)).

**Después del primer despliegue:** enviar el sitemap en Google Search Console (ver
[docs/seo.md](docs/seo.md#3-qué-hay-que-hacer-fuera-del-código)).

## Créditos

- Proyecto de **Jaime H. Borja Gómez**, Profesor Titular, Departamento de Historia y Geografía,
  Universidad de los Andes.
- Desarrollo digital y modelado de datos: **Juan Camilo González** – [EnFlujo](https://enflujo.com).
- Centro de Estudios en Periodismo (CEPER) – Universidad de los Andes.
- Diseño y desarrollo de la sección «Visualización y análisis» y rediseño del sitio web versión 2026:
  **Angela Milena Ortiz Torres**.
