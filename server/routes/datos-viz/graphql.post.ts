// Punto de entrada de la copia en el servidor para «Visualización y análisis» (ver server/utils/copiaViz.ts).
// La página de la visualización envía aquí sus consultas GraphQL en lugar de ir directo al API.

const TAMANO_MAXIMO = 20000; // caracteres de una consulta

export default defineEventHandler(async (event) => {
  const cuerpo = await readBody<{ query?: unknown }>(event);
  const consulta = typeof cuerpo?.query === 'string' ? cuerpo.query : '';

  // Solo lectura: consultas razonables y nunca mutaciones.
  if (!consulta || consulta.length > TAMANO_MAXIMO || /\bmutation\b/i.test(consulta)) {
    throw createError({ statusCode: 400, statusMessage: 'Consulta no permitida' });
  }

  try {
    const texto = await consultaCacheada(consulta);
    recordarConsulta(consulta).catch(() => {});
    setHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    return texto;
  } catch {
    // La página vuelve a intentar directo contra el API si esto falla.
    throw createError({ statusCode: 502, statusMessage: 'El API de ARCA no respondió' });
  }
});
