import { createHash } from 'node:crypto';
import { apiBase } from '~/config/general';

// Copia en el servidor de las consultas GraphQL que hace «Visualización y análisis» al abrirse
// (totales, geografía y las 27.000 obras en bloques). El API de ARCA responde lento y marca sus
// respuestas como no guardables; con esta copia, solo la primera consulta del periodo espera al API
// y las demás visitas reciben los datos al instante. La copia se renueva sola en segundo plano.

/** Horas que una respuesta se considera fresca; después se entrega igual y se renueva por detrás. */
export const HORAS_COPIA = 6;

const huella = (consulta: string) => createHash('sha1').update(consulta.replace(/\s+/g, ' ').trim()).digest('hex');

/** Consultas vistas (para renovarlas periódicamente sin esperar a que alguien abra la visualización). */
export async function recordarConsulta(consulta: string) {
  const almacen = useStorage('data');
  const lista = ((await almacen.getItem<string[]>('viz:consultas')) ?? []).filter((c) => c !== consulta);
  lista.unshift(consulta);
  await almacen.setItem('viz:consultas', lista.slice(0, 80));
}

export async function consultasRecordadas(): Promise<string[]> {
  return (await useStorage('data').getItem<string[]>('viz:consultas')) ?? [];
}

/** Respuesta del API (texto JSON) guardada en caché. Los errores no se guardan. */
export const consultaCacheada = defineCachedFunction(
  async (consulta: string): Promise<string> => {
    const texto = await $fetch<string>(`${apiBase}/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: consulta }),
      responseType: 'text',
      timeout: 150000,
      retry: 2,
    });

    const json = JSON.parse(texto);
    if (!json?.data) throw new Error('El API de ARCA respondió sin datos');
    return texto;
  },
  {
    name: 'viz-graphql',
    maxAge: 60 * 60 * HORAS_COPIA,
    swr: true,
    getKey: huella,
  }
);
