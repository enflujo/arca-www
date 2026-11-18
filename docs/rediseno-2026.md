# Rediseño 2026

Guía del lenguaje visual y de la estructura de páginas del sitio de ARCA a partir de la versión 2026.
Sirve para mantener la coherencia al modificar páginas existentes o crear nuevas.

Diseño y desarrollo: Angela Milena Ortiz Torres. Los diseños de referencia (exportados de la
herramienta de diseño, 1440 px de ancho) son: Inicio, Colección · Clasificación por temas, Sobre ARCA,
Sobre ARCA · 2016–2022, Recursos · Productos relacionados, Recursos · Uso de imágenes y bibliografía y
Recursos · Open Source. Las páginas sin diseño propio (fichas de obra, galerías, demás índices de la
Colección) se adaptaron al mismo lenguaje.

---

## 1. Lenguaje visual

### Colores

Definidos como variables CSS en `assets/scss/_constantes.scss` (y como variables SCSS para usar en
funciones como `rgba()`).

| Variable        | Valor     | Uso                                                       |
| --------------- | --------- | --------------------------------------------------------- |
| `--tinta`       | `#1c1512` | Fondo oscuro (encabezado, áreas principales) y texto      |
| `--tintaPanel`  | `#261d18` | Paneles sobre fondo oscuro (buscadores, avisos)           |
| `--pergamino`   | `#f3e9d8` | Fondo claro general                                       |
| `--papel`       | `#faf6ec` | Tarjetas y paneles claros, menú lateral, pie de página    |
| `--arena`       | `#e8dcc4` | Resaltados suaves (opción activa del menú lateral, chips) |
| `--borde`       | `#d8c8ae` | Bordes finos                                              |
| `--bordeFuerte` | `#bda87f` | Separadores de sección                                    |
| `--ocre`        | `#8a5f14` | Acento sobre claro: botones, enlaces, etiquetas           |
| `--ocreOscuro`  | `#6e4a0e` | Botones al pasar el cursor                                |
| `--oro`         | `#d9ac4f` | Acento sobre oscuro: títulos, sección activa del menú     |
| `--textoSuave`  | `#6b5646` | Textos secundarios y etiquetas de campo                   |
| `--textoCuerpo` | `#574538` | Párrafos dentro de paneles claros                         |
| `--sobreOscuro` | `#f3e9d8` | Texto sobre fondo oscuro                                  |

Los nombres anteriores (`--dolor`, `--profundidad`, `--verdeEsmeralda`, `--amarilloBase`…) se
conservan y apuntan a la paleta nueva, para no romper componentes que aún los usan. **En código nuevo
usar los nombres nuevos.**

### Tipografías

- **IM Fell English** (`--fuenteSerif`): títulos (`h1`, `h2`, `h3`), entradillas, cifras grandes.
- **Manrope** (`--fuenteSans`): texto corrido, interfaz, menús, etiquetas.

Se cargan desde Google Fonts en `nuxt.config.ts`. Las reglas base están en
`assets/scss/_normalizar.scss`.

### Piezas recurrentes

| Pieza                      | Dónde está                               |
| -------------------------- | ---------------------------------------- |
| Sobretítulo (ceja)         | clase `.ceja` (layout `archivo`)         |
| Título de página dorado    | clase `.tituloPagina` (layout `archivo`) |
| Entradilla serif           | clase `.entradilla` (layout `archivo`)   |
| Panel claro                | clase `.panelClaro` (layout `archivo`)   |
| Botón ocre / de contorno   | clases `.botonOcre`, `.botonContorno`    |
| Píldora (DOI, enlaces)     | clase `.pildora`                         |
| Chip dentro de panel       | clase `.chipPanel`                       |
| Crédito de imagen          | `components/Paginas/Credito.vue`         |
| Píldoras de campos de obra | `components/Registro/Lista.vue`          |

Las clases compartidas viven en el segundo bloque `<style>` de `layouts/archivo.vue`, dentro de
`:where(#contenido).oscuro`. El `:where()` les da prioridad baja a propósito: ganan a los estilos base,
pero los estilos propios de cada página las pueden ajustar.

---

## 2. Navegación

Toda la navegación sale de **`utilidades/menu.ts`**:

- `MENU_PRINCIPAL`: las 5 entradas del encabezado (Home, Colección de ARCA, Visualización y análisis,
  Recursos, Sobre ARCA).
- `SUBPAGINAS`: las páginas del menú lateral de Recursos y de Sobre ARCA.
- `seccionDeRuta(ruta)`: dice a qué sección pertenece una URL (para marcar la entrada activa y elegir
  el menú lateral).

Lo usan `components/Encabezado.vue`, `components/Menu/Archivo.vue` y la barra que se inserta en la
visualización (`server/routes/visualizacion-y-analisis.get.ts`).

> **Importante:** el menú principal ya **no** se arma con la lista de páginas del CMS. Si se crea una
> página nueva en Directus y debe aparecer en el menú, hay que agregarla en `utilidades/menu.ts`.

El menú lateral de la Colección sí sigue saliendo del CMS (`paginas_archivo` con `mostrar_en_menu`).

---

## 3. Plantillas (layouts)

| Layout    | Páginas                                                                  |
| --------- | ------------------------------------------------------------------------ |
| `default` | Home, fichas de obra                                                     |
| `archivo` | Colección (índices y galerías), Recursos y Sobre ARCA — con menú lateral |
| `paginas` | Páginas generales que no pertenecen a ninguna sección                    |

En `layouts/archivo.vue`, la clase `oscuro` (área principal oscura con paneles claros) se activa en
Recursos, Sobre ARCA y en los índices de la Colección (rutas de un solo tramo, p. ej. `/autores`).
Las galerías (`/autores/123`) conservan el fondo claro.

El encabezado va transparente sobre la imagen del Home y se vuelve oscuro al desplazarse
(`components/Encabezado.vue`).

---

## 4. Páginas

### Home — `paginas/index.vue`

- **Hero:** «Diluvio», de Cristóbal de Villalpando (registro 595). Para cambiar la obra, modificar la
  constante `REGISTRO_PORTADA`. La imagen, el título, el autor y el número salen del API.
- **Cifras:** el total de obras se lee en vivo del API (`obras_aggregated`); las demás (800 mil
  etiquetas, 1530–1830, 3 Américas) están en el código.
- **Sobre esta versión:** muestra la sección «Arte Colonial Americano (ARCA)» del campo `secciones` de
  la página `sobre-arca` del CMS. Se quitan los párrafos vacíos y «veinticinco mil» se reemplaza por el
  total en vivo.
- **Dos maneras de entrar**, **Recursos** e **Historia** (línea de tiempo): contenido en el código.

### Páginas generales con diseño propio — `components/PaginaGeneral.vue`

`PaginaGeneral` pide la página al CMS y, según su `slug`, usa una plantilla de `components/Paginas/`:

| Slug                         | Componente                 |
| ---------------------------- | -------------------------- |
| `sobre-arca`                 | `Paginas/SobreArca.vue`    |
| `arca-version-2016-2022`     | `Paginas/Arca2016.vue`     |
| `productos-relacionados`     | `Paginas/Productos.vue`    |
| `bibliografia-y-referencias` | `Paginas/Bibliografia.vue` |
| `open-source`                | `Paginas/OpenSource.vue`   |

Cualquier otro slug usa la plantilla general (título + contenido del CMS).

**Qué viene del CMS y qué del código:**

- Los **textos** de estas páginas siguen el diseño y están en el código (coinciden con los del CMS a
  noviembre de 2026).
- Las **imágenes** se leen del contenido del CMS (`utilidades/contenidoCMS.ts`). Si el texto
  alternativo de la imagen empieza con un número de registro (p. ej. «12278 Charles Willson…»), se
  muestra el crédito de la obra con enlace a su ficha.
- La **bibliografía** (539 referencias en 3 secciones) se lee completa del CMS y se separa por sus
  títulos `<h2>/<h3>`. Tiene un buscador que no distingue tildes ni mayúsculas.

Para agregar una página con diseño propio: crear el componente en `components/Paginas/`, añadirlo al
`<template>` de `PaginaGeneral.vue` y su descripción SEO en `PLANTILLAS`.

### Colección

- **Clasificación por temas** — `paginas/categorias[[numero]]/index.vue`: tarjetas con imagen, conteo
  (la línea es proporcional al número de obras), descripción y subcategorías desplegables hasta 6
  niveles. Orden A–Z o por cantidad (`?vista=colombinas`).
- **Demás índices** — `paginas/[...slug].vue` (`archivoIndice`) + `components/Vista/`: descripción en
  panel claro y el índice (A–Z, por cantidad o mapa) en otro. El selector de vista son píldoras
  (`components/Vista/FiltrosVistas.vue`).
- **Galerías** — `components/Galeria/`: tarjetas de obra en papel con borde.

### Ficha de obra — `paginas/obras/[registro].vue`

- Columna izquierda: imagen (con lupa, zoom y descarga) y, debajo, **el mapa del recorrido**
  (`components/Registro/MapaObra.vue`): dónde se pintó (ciudad de origen) y dónde está hoy, unidos por
  una línea punteada, con la distancia aproximada. Si la obra no se movió de ciudad, muestra un punto.
- Columna derecha: campos de la obra. La **clasificación** se muestra como ruta resaltada
  (tema › subtema…) y los demás campos de lista como píldoras enlazadas.

### Pie de página — `components/Guardaescobas.vue`

Los créditos están en el código, con los nombres enlazados. **Ya no se usa** el campo
`general.texto_footer` del CMS.

---

## 5. Responsive

- Puntos de corte (`assets/scss/_constantes.scss`): 576, 768, 992, 1200 y 1920 px.
- Debajo de 1200 px el menú lateral se oculta tras el botón ☰.
- En celular el menú principal se desplaza horizontalmente y el buscador queda como ícono.
- El Home se probó en 390, 768 y 1440 px.

Pendiente conocido: la ficha de obra y las galerías tienen desbordes horizontales en celular que ya
existían antes del rediseño.

---

## 6. Pendientes y sugerencias

- Diseño propio para fichas de obra, galerías, resultados de búsqueda y página de error 404.
- El buscador (ventana que se abre desde el encabezado) conserva el estilo anterior.
- Revisar en el CMS: el texto «veinticinco mil pinturas» de la página `sobre-arca` y el título
  «BIBLIOGRAFIA GENERAL DE LAS F UENTES» (con un espacio de más) de `bibliografia-y-referencias`.

---

## 7. Ajustes tras la revisión del profesor Jaime Borja (noviembre de 2026)

- **Tres grupos en la Colección:** el menú lateral y la ficha de obra se ordenan en «Datos básicos»,
  «Datos de análisis» y «Datos de gestos», el mismo orden del panel de filtros de «Visualización y
  análisis». Los grupos están en `GRUPOS_COLECCION` (`utilidades/menu.ts`): `paginas` son los slugs del
  menú lateral y `campos` los campos de la ficha. Los campos que no pertenecen a ningún grupo (síntesis,
  comentario, fuente de la imagen) van al final, bajo «Descripción y fuente».
- **«Países»** sale del menú lateral porque su contenido está en «Geografía, países y ubicaciones»
  (`PAGINAS_OCULTAS_MENU`, `TITULOS_MENU`). La página `/paises` sigue existiendo.
- **Menú en celular y tableta (menos de 992 px):** botón ☰ en el encabezado que abre un panel con las 5
  secciones y las páginas de la sección actual (`components/Encabezado.vue`; las páginas salen de
  `composables/menuSeccion.ts`, igual que el menú lateral).
- **Mapa de la ficha:** más alto (340 px) y con botón de pantalla completa.
- **Selector de vistas destacado:** franja con la explicación «Este índice se puede ver de dos maneras…» y
  control segmentado (`components/Vista/FiltrosVistas.vue`).
- **Vínculos visibles** debajo de las imágenes de ARCA 2016–2022 y de Productos relacionados.
- **Sitio más compacto:** letra base de 15 px, encabezado de 64 px, títulos, paneles, menú lateral (270 px),
  ficha de obra (14 px) y pie de página más pequeños.
- **Pie de página:** nuevo aviso bajo el correo sobre el origen de la información de los registros.

## 8. Accesibilidad (noviembre de 2026)

- **Paleta con más contraste:** los textos secundarios y el ocre sobre fondos claros se oscurecieron
  (`--textoSuave` #4a382b, `--textoCuerpo` #3b2d24, `--ocre` #74500f). Todas las combinaciones de texto
  pequeño sobre pergamino, papel y arena cumplen WCAG AA (4,5:1) o más.
- **Modo de alto contraste:** botón «◐ Contraste» en el encabezado de todas las páginas, también en
  «Visualización y análisis». Pone fondo blanco, oscurece textos y bordes, subraya enlaces de los
  párrafos y, en la visualización, aumenta el contraste y la saturación de las gráficas. La preferencia
  se guarda en `localStorage` (`arca.contraste`) y se puede activar con `?contraste=alto` en la URL.
  Estilos en `assets/css/contraste.css`; botón en `components/BotonContraste.vue`.
- **Etiquetas de metadatos:** en la ficha de obra todos los valores enlazados (lugares, campos de una
  sola opción, listas y gestos) se muestran como etiquetas rojas (`--carmin` #8e2a1e, 7,8:1 sobre papel),
  para que se note que se puede hacer clic. El estilo es el mixin `etiquetaMeta`
  (`assets/scss/_constantes.scss`). La ruta de clasificación conserva su estilo propio.
