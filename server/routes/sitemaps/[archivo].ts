import { aSlug, escaparXML, urlImagenPublica } from '~/utilidades/seo';

interface ObraSitemap {
  registro: number;
  titulo: string;
  imagen?: { id: string } | null;
}

// /sitemaps/paginas.xml  → páginas generales y de archivo
// /sitemaps/obras-N.xml  → fichas de obra, cada una con su imagen (extensión de imágenes de Google)
export default defineCachedEventHandler(
  async (event) => {
    const archivo = getRouterParam(event, 'archivo') ?? '';
    setHeader(event, 'Content-Type', 'application/xml; charset=utf-8');

    if (archivo === 'paginas.xml') {
      const datos = await consultaAPI<{ paginas: { slug: string }[]; paginas_archivo: { slug: string }[] }>(`query {
        paginas(filter: { estado: { _eq: "publicado" } }) { slug }
        paginas_archivo(filter: { estado: { _eq: "publicado" } }) { slug }
      }`);

      const rutas = ['/', ...datos.paginas.map((p) => `/${p.slug}`), ...datos.paginas_archivo.map((p) => `/${p.slug}`)];
      const entradas = [...new Set(rutas)].map((r) => `  <url><loc>${escaparXML(url(r))}</loc></url>`).join('\n');

      return documentoXML(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entradas}\n</urlset>`);
    }

    const bloque = /^obras-(\d+)\.xml$/.exec(archivo);
    if (!bloque) throw createError({ statusCode: 404, statusMessage: 'Sitemap no encontrado' });

    const numero = Number(bloque[1]);
    const desde = (numero - 1) * OBRAS_POR_SITEMAP;
    const datos = await consultaAPI<{ obras: ObraSitemap[] }>(`query {
      obras(limit: ${OBRAS_POR_SITEMAP}, offset: ${desde}, sort: ["registro"]) { registro titulo imagen { id } }
    }`);

    if (!datos.obras.length) throw createError({ statusCode: 404, statusMessage: 'Sitemap no encontrado' });

    const entradas = datos.obras
      .map((o) => {
        const imagen = o.imagen?.id
          ? `\n    <image:image><image:loc>${escaparXML(urlImagenPublica(o.imagen.id, o.titulo || aSlug(String(o.registro)), 'obra', true))}</image:loc></image:image>`
          : '';
        return `  <url>\n    <loc>${url(`/obras/${o.registro}`)}</loc>${imagen}\n  </url>`;
      })
      .join('\n');

    return documentoXML(
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${entradas}\n</urlset>`
    );
  },
  {
    maxAge: 60 * 60 * 12,
    swr: true,
    name: 'sitemap-archivo',
    getKey: (event) => getRouterParam(event, 'archivo') ?? '',
  }
);
