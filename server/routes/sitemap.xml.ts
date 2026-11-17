// Índice de sitemaps: /sitemaps/paginas.xml y /sitemaps/obras-N.xml (con sus imágenes).
export default defineCachedEventHandler(
  async (event) => {
    const total = await totalObras();
    const bloques = Math.max(1, Math.ceil(total / OBRAS_POR_SITEMAP));

    const archivos = ['paginas.xml', ...Array.from({ length: bloques }, (_, i) => `obras-${i + 1}.xml`)];
    const entradas = archivos.map((a) => `  <sitemap><loc>${url(`/sitemaps/${a}`)}</loc></sitemap>`).join('\n');

    setHeader(event, 'Content-Type', 'application/xml; charset=utf-8');
    return documentoXML(
      `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entradas}\n</sitemapindex>`
    );
  },
  { maxAge: 60 * 60 * 12, swr: true, name: 'sitemap-indice' }
);
