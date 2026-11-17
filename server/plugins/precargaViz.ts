// Precarga de «Visualización y análisis»: renueva periódicamente, en el servidor, las consultas que la
// visualización hace al abrirse. Así la copia está lista antes de que alguien la visite.

const CADA_HORAS = 5;

async function renovar() {
  const consultas = await consultasRecordadas();
  // De a una, para no saturar el API.
  for (const consulta of consultas) {
    await consultaCacheada(consulta).catch(() => {});
  }
}

export default defineNitroPlugin(() => {
  // No en la compilación ni en entornos sin servidor persistente.
  if (import.meta.prerender) return;

  // En producción pm2 corre varias instancias (exec_mode: 'cluster', instances: 'max'). Comparten la
  // caché en disco (.data/), así que basta con que una sola —la 0— renueve, para no multiplicar las
  // consultas al API.
  const instancia = process.env.NODE_APP_INSTANCE ?? process.env.pm_id;
  if (instancia !== undefined && instancia !== '0') return;

  setTimeout(() => renovar().catch(() => {}), 30_000);
  setInterval(() => renovar().catch(() => {}), CADA_HORAS * 60 * 60 * 1000);
});
