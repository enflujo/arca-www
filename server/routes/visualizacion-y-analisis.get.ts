import { urlBase } from '~/config/general';
import { MENU_PRINCIPAL } from '~/utilidades/menu';

// «Visualización y análisis»: se sirve directamente el HTML independiente de ARCA VIVO
// (server/assets/visualizacion-y-analisis.html), sin pasar por las páginas de Nuxt.
// Para conservar la navegación del sitio, se le inserta arriba la barra de menú de ARCA,
// con el mismo menú de components/Encabezado.vue (utilidades/menu.ts).

const SLUG = 'visualizacion-y-analisis';
const ALTO = 72; // igual a $altoEncabezado

const escapar = (texto: string) =>
  texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const TITULO = 'Visualización y análisis | ARCA · Arte Colonial Americano';
const DESCRIPCION =
  'Explora las 27.000 pinturas coloniales de ARCA como conjunto: escala, cronología, geografía de las obras y lenguaje gestual, con filtros por país, periodo y tema.';
const URL_PAGINA = `${urlBase}/${SLUG}`;

const metadatos = [
  `<meta name="description" content="${escapar(DESCRIPCION)}">`,
  `<link rel="canonical" href="${URL_PAGINA}">`,
  `<meta property="og:type" content="website">`,
  `<meta property="og:url" content="${URL_PAGINA}">`,
  `<meta property="og:title" content="${escapar(TITULO)}">`,
  `<meta property="og:description" content="${escapar(DESCRIPCION)}">`,
  `<meta property="og:image" content="${urlBase}/arca-of.webp">`,
  `<meta name="twitter:card" content="summary_large_image">`,
].join('\n');

// Estilos de la barra (los mismos de components/Encabezado.vue) y ajustes para que los
// elementos fijos o pegajosos de la visualización empiecen debajo de ella.
const estilos = `
<link href="https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=Manrope:wght@400;500;600&display=swap" rel="stylesheet">
<style id="arca-menu">
#arcaEncabezado{height:${ALTO}px;position:fixed;top:0;left:0;width:100%;box-sizing:border-box;padding:0 1em;background-color:#1c1512;border-bottom:1px solid rgba(243,233,216,.16);color:#f3e9d8;z-index:44;display:flex;align-items:center;gap:1.5em;font-size:16px;line-height:1.5}
#arcaEncabezado a{text-decoration:none}
#arcaEncabezado .nombreProyecto{display:flex;align-items:baseline;gap:.6em;flex-shrink:0;line-height:1;color:#f3e9d8}
#arcaEncabezado .nombreProyecto:hover{opacity:.85}
#arcaEncabezado .marca{font-family:'IM Fell English',Georgia,serif;font-size:2em;letter-spacing:.04em}
#arcaEncabezado .lema{display:none;font-family:'IM Fell English',Georgia,serif;font-style:italic;font-size:1.05em;color:#d9ac4f}
#arcaEncabezado nav{display:flex;align-items:center;gap:1.6em;flex:1 1 auto;min-width:0;overflow-x:auto;scrollbar-width:none;font-family:'Manrope','Helvetica Neue',Arial,sans-serif;font-size:.92em;font-weight:500}
#arcaEncabezado nav::-webkit-scrollbar{display:none}
#arcaEncabezado nav a{color:#f3e9d8;white-space:nowrap;padding:.35em 0}
#arcaEncabezado nav a:hover,#arcaEncabezado nav a.activo{color:#d9ac4f}
#arcaEncabezado .buscarSitio{margin-left:auto;flex-shrink:0;display:flex;align-items:center;justify-content:space-between;gap:.8em;height:40px;width:40px;padding:0 12px;box-sizing:border-box;border-radius:999px;border:1px solid rgba(243,233,216,.28);background:rgba(28,21,18,.55);color:#bfae96;font-family:'Manrope','Helvetica Neue',Arial,sans-serif;font-size:.85em;transition:border-color .2s ease,color .2s ease}
#arcaEncabezado .buscarSitio:hover{border-color:#d9ac4f;color:#f3e9d8}
#arcaEncabezado .buscarSitio span{display:none;white-space:nowrap}
#arcaEncabezado .buscarSitio svg{width:16px;height:16px;flex-shrink:0;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round}
@media (max-width:767px){#arcaEncabezado{gap:1em}#arcaEncabezado .marca{font-size:1.7em}}
@media (min-width:992px){#arcaEncabezado{padding:0 2.5em}#arcaEncabezado .buscarSitio{width:230px;padding:0 16px 0 18px}#arcaEncabezado .buscarSitio span{display:block}}
@media (min-width:1200px){#arcaEncabezado{padding:0 3.5em;gap:1.75em}#arcaEncabezado .lema{display:block}#arcaEncabezado nav{justify-content:center;gap:2em}}
body{padding-top:${ALTO}px}
header.cabeza{top:${ALTO}px}
/* «ARCA Arte Colonial Americano» ya está en la barra del sitio: se oculta a la vista, no a los lectores de pantalla */
header.cabeza h1{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
/* «27.000 obras» a la izquierda, en el mismo renglón que «Conectado a…», para que el encabezado no sea tan alto */
header.cabeza>div:first-child{display:contents}
header.cabeza .conexion{grid-column:1/-1;flex-direction:row;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:4px 24px}
header.cabeza .conexion .alcance{text-align:left}
.panel-filtros{top:${ALTO}px;height:calc(100% - ${ALTO}px)}
.explorador{top:${ALTO}px}
/* Carga discreta: en lugar de cubrir la pantalla, una barra fina bajo el menú y un aviso pequeño.
   El menú, los filtros y el buscador se ven desde el primer momento. */
.carga{inset:auto 0 auto var(--ancho-panel,0px)!important;top:${ALTO}px!important;height:auto!important;background:none!important;display:block!important;pointer-events:none;z-index:46}
.carga-marco{width:auto!important;text-align:left!important}
.carga-nombre,.carga-escena,.carga-obra{display:none!important}
.carga-barra{width:100%!important;height:3px!important;border-radius:0!important;margin:0!important;background:rgba(74,58,49,.55)!important}
.carga-barra span{border-radius:0!important}
.carga-estado{display:inline-block;margin:10px 16px 0!important;padding:6px 14px;border-radius:999px;background:#261d18;border:1px solid #3a2e27;color:#d8c9b2!important;font-size:.8rem!important;box-shadow:0 4px 14px rgba(0,0,0,.3)}
body.cargando{overflow:auto!important}
</style>`;

// Las consultas GraphQL de la visualización pasan por la copia del servidor (/datos-viz/graphql), que
// responde al instante cuando ya tiene los datos. Si algo falla, se repite directo contra el API.
const copiaServidor = `<script>
(function(){
  var API='https://apiarca.uniandes.edu.co/graphql', COPIA='/datos-viz/graphql', original=window.fetch.bind(window);
  window.fetch=function(recurso, opciones){
    var url=typeof recurso==='string'?recurso:(recurso&&recurso.url)||'';
    if(url===API && opciones && String(opciones.method).toUpperCase()==='POST'){
      return original(COPIA, opciones).then(function(r){ return r.ok ? r : original(recurso, opciones); })
        .catch(function(e){ if(opciones.signal&&opciones.signal.aborted) throw e; return original(recurso, opciones); });
    }
    return original(recurso, opciones);
  };
})();
</script>`;

const menu = `<header id="arcaEncabezado"><a class="nombreProyecto" href="/" aria-label="ARCA · Arte Colonial Americano, inicio"><span class="marca">ARCA</span><span class="lema">Arte Colonial Americano</span></a><nav aria-label="Menú principal">${MENU_PRINCIPAL.map(
  (e) => {
    const activo = e.seccion === 'visualizacion' ? ' class="activo" aria-current="page"' : '';
    return `<a href="${e.ruta}"${activo}>${escapar(e.titulo)}</a>`;
  }
).join(
  ''
)}</nav><a class="buscarSitio" href="/?buscar=" aria-label="Buscar obras, autores, temas…"><span>Buscar obras, autores…</span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg></a></header>`;

// Enlace directo a una pestaña: /visualizacion-y-analisis?pestana=gestos (general | analisis | gestos).
// Espera a que el tablero termine de cargar las obras y abre la pestaña pedida.
const pestanaDesdeURL = `<script>
(function(){
  var p = new URLSearchParams(location.search).get('pestana');
  if (!p || !/^(general|analisis|gestos)$/.test(p)) return;
  var intentos = 0, reloj = setInterval(function(){
    var listo = typeof S !== 'undefined' && S.obras && S.obras.length && typeof verPestana === 'function';
    if (listo) { clearInterval(reloj); verPestana(p); }
    else if (++intentos > 600) clearInterval(reloj);
  }, 200);
})();
</script>`;

export default defineEventHandler(async (event) => {
  const html = await useStorage('assets:server').getItem<string>(`${SLUG}.html`);

  if (!html) {
    throw createError({ statusCode: 404, statusMessage: 'Visualización no encontrada' });
  }

  const pagina = html
    // Título y metadatos para buscadores y redes, en el formato del resto del sitio.
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapar(TITULO)}</title>`)
    .replace(/<head[^>]*>/, (cabeza) => `${cabeza}\n${metadatos}\n${copiaServidor}`)
    .replace('</head>', `${estilos}\n</head>`)
    .replace(/<body[^>]*>/, (body) => `${body}\n${menu}`)
    .replace(/<\/body>(?![\s\S]*<\/body>)/, `${pestanaDesdeURL}\n</body>`);

  setHeader(event, 'Content-Type', 'text/html; charset=utf-8');
  return pagina;
});
