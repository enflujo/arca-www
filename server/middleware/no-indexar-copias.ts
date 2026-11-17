// Solo el dominio oficial se deja indexar. Cualquier otra copia del sitio (vistas previas para revisión,
// pruebas locales) responde «noindex» para que Google no la tome como contenido duplicado de ARCA.

const DOMINIO_OFICIAL = 'arca.uniandes.edu.co';

export default defineEventHandler((event) => {
  const host = (getRequestHost(event, { xForwardedHost: true }) || '').split(':')[0]?.toLowerCase() ?? '';
  if (host !== DOMINIO_OFICIAL) {
    setHeader(event, 'X-Robots-Tag', 'noindex, nofollow');
  }
});
