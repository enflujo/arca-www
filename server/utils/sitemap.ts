import { apiBase, urlBase } from '~/config/general';

/** Obras por archivo de sitemap (Google acepta hasta 50.000 URL; bloques pequeños se generan más rápido). */
export const OBRAS_POR_SITEMAP = 5000;

export async function consultaAPI<T>(query: string): Promise<T> {
  const res = await $fetch<{ data: T; errors?: unknown }>(`${apiBase}/graphql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
    timeout: 60000,
  });
  if (!res?.data) throw createError({ statusCode: 502, statusMessage: 'El API de ARCA no respondió' });
  return res.data;
}

export async function totalObras(): Promise<number> {
  const datos = await consultaAPI<{ obras_aggregated: { count: { registro: number } }[] }>(
    'query { obras_aggregated { count { registro } } }'
  );
  return datos.obras_aggregated?.[0]?.count?.registro ?? 0;
}

export function documentoXML(contenido: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n${contenido}`;
}

export const url = (ruta: string) => `${urlBase}${ruta}`;
