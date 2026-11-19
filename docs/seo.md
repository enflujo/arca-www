# SEO: cómo encuentran los buscadores a ARCA

Qué se hizo para que Google (y otros buscadores) indexen bien el sitio y sus 27.000 obras, cómo
funciona cada pieza y qué hay que hacer fuera del código.

---

## 1. El problema que había (noviembre de 2026)

1. **Enlaces rotos en Google.** Al buscar una pintura por su nombre, Google mostraba la imagen con un
   enlace a la versión anterior (`arcav1.uniandes.edu.co`), que responde con error 500.
2. **Imágenes no indexables.** Las imágenes se sirven desde `apiarca.uniandes.edu.co`, cuyo
   `robots.txt` (el predeterminado de Directus) es `Disallow: /`: Google no puede leerlas.
3. **Fichas vacías para Google.** La ficha de obra pedía casi todos sus datos solo en el navegador; el
   HTML traía el título y una imagen vacía.
4. **Sin `robots.txt` ni `sitemap.xml`** en el sitio (esas URL devolvían la página de inicio).
5. Índices y galerías de la Colección sin enlaces en el HTML; descripciones con HTML crudo; títulos poco
   claros («Obra | : Arca :»).

---

## 2. Qué se hizo

### Fichas de obra — `paginas/obras/[registro].vue`

- Todos los datos se piden en el servidor: el HTML trae imagen, autor, fecha, lugar, técnica, síntesis
  y campos.
- **Imagen real en el HTML** (antes era un recuadro vacío que se llenaba con JavaScript), con texto
  alternativo descriptivo: «Título · Autor · Fechas».
- **Descripción propia** (`<meta name="description">`, máx. 160 caracteres): título, autoría, fecha,
  lugar y síntesis.
- **Datos estructurados** JSON-LD tipo
  [`VisualArtwork`](https://schema.org/VisualArtwork): nombre, imagen, creador (excepto «Anónimo»),
  fechas, técnica, lugar de creación, fuente de la imagen y enlace a «Uso de imágenes».
- Registros inexistentes o inválidos responden **404** (antes 500 o página vacía).

### Imágenes desde el dominio de ARCA

- Ruta `server/routes/imagenes/[llave]/[id]/[nombre].get.ts`:
  `https://arca.uniandes.edu.co/imagenes/obra/{id}/{titulo-de-la-obra}.webp`
- Sirve la imagen del API con caché de 30 días. El nombre del archivo es descriptivo (ayuda a Google
  Imágenes); la imagen se identifica por su `id`.
- Solo acepta ids de Directus (UUID) y las llaves `obra` y `og-banner` (`utilidades/seo.ts`), para que
  no funcione como proxy abierto.
- `/obras/{registro}/imagen` redirige a la imagen de esa obra (lo usan las redirecciones de arcav1).

### robots.txt y sitemap

- `public/robots.txt`: permite todo excepto `/datos-viz/` y anuncia el sitemap.
- `https://arca.uniandes.edu.co/sitemap.xml`: índice de sitemaps (`server/routes/sitemap.xml.ts`).
  - `/sitemaps/paginas.xml`: Home, páginas generales y páginas de la Colección.
  - `/sitemaps/obras-1.xml` … `obras-6.xml`: 5.000 obras por archivo, **cada una con su imagen**
    (extensión de imágenes de Google).
- Se generan desde el API y se guardan 12 horas en caché (`server/utils/sitemap.ts`).

### Índices y galerías en el HTML

`composables/obtenerDatosAsinc.ts` ahora también pide los datos en el servidor, y
`components/Vista/` espera esos datos: los índices (Autores, Técnicas, Símbolos, Gestos…) y las
galerías llegan con todos sus enlaces. Ejemplo: `/autores` trae 1.189 enlaces a galerías de autores.

### Títulos, descripciones y canonical — `composables/elementosCabeza.ts`

- Títulos: «Ángel de la guarda | ARCA · Arte Colonial Americano».
- Descripciones: sin HTML ni entidades, recortadas a 160 caracteres.
- Una etiqueta `canonical` por página con su propia URL.
- «Visualización y análisis» tiene título, descripción, canonical y metadatos para redes
  (`server/routes/visualizacion-y-analisis.get.ts`).

### Redirecciones desde la versión anterior

Ver **[redirecciones-arcav1.md](./redirecciones-arcav1.md)**. El número de obra de arcav1 es el mismo
`registro` actual (verificado con copias del Internet Archive). Las reglas están en
`server/middleware/redirecciones-arcav1.ts` y se activan cuando llega una petición con el dominio
`arcav1.uniandes.edu.co`.

### Copias que no se indexan — `server/middleware/no-indexar-copias.ts`

Cualquier petición con un dominio distinto de `arca.uniandes.edu.co` (pruebas locales, vistas previas)
responde con `X-Robots-Tag: noindex, nofollow`, para que Google no indexe copias como contenido
duplicado.

---

## 3. Qué hay que hacer fuera del código

1. **Desplegar** estos cambios (ver «Despliegue» en el README). Hasta entonces Google no ve nada nuevo.
2. **Redirecciones de arcav1:** apuntar `arcav1.uniandes.edu.co` al servidor del sitio nuevo (DNS o
   proxy, conservando la cabecera `Host`) o configurar las reglas en el servidor viejo. Es lo que
   arregla los enlaces rotos de Google Imágenes.
3. **Google Search Console** (propiedad de `arca.uniandes.edu.co`):
   - Enviar `https://arca.uniandes.edu.co/sitemap.xml` en «Sitemaps».
   - Si `arcav1.uniandes.edu.co` está verificado, usar **Cambio de dirección** hacia el dominio nuevo.
   - Revisar «Páginas» e «Imágenes» en las semanas siguientes.
4. **Opcional:** en Directus, la variable `ROBOTS_TXT` permite abrir `/assets/` del API a los
   buscadores. No es necesario, porque el sitio ya sirve las imágenes desde su dominio.

---

## 4. Cómo verificar

Con el sitio corriendo (local o en producción):

```bash
# robots y sitemap
curl https://arca.uniandes.edu.co/robots.txt
curl https://arca.uniandes.edu.co/sitemap.xml
curl https://arca.uniandes.edu.co/sitemaps/obras-1.xml | head

# Lo que lee Google en una ficha: título, descripción, imagen y datos estructurados
curl -s https://arca.uniandes.edu.co/obras/565 | grep -E '<title>|name="description"|application/ld\+json|/imagenes/obra/'

# Redirecciones de arcav1 (simulando el dominio viejo)
curl -I -H "Host: arcav1.uniandes.edu.co" https://arca.uniandes.edu.co/artworks/10742
```

Herramientas externas: [Prueba de resultados enriquecidos](https://search.google.com/test/rich-results)
(datos estructurados) e «Inspección de URLs» en Search Console.
