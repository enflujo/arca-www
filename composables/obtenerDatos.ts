import { apiBase } from '~/config/general';

/**
 * Hace llamado a la base de datos de Directus en Graphql.
 *
 * @param llave Un texto único para registrar el llamado a la base de datos.
 * @param query Query en formato Graphql.
 * @returns Devuelve los datos un nivel dentro: `data.data`
 */
export default async function obtenerDatos<Esquema>(llave: string, query: string, sistema = false) {
  const { data, error } = await useAsyncData<Esquema>(
    llave,
    () => {
      // console.log('EN SERVIDOR', query);
      return $fetch(`${apiBase}/graphql${sistema ? '/system' : ''}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
    },
    {
      transform: (res: any) => res?.data || null,
    }
  );

  if (error.value) {
    throw new Error(JSON.stringify(error.value, null, 2));
  }

  if (!data.value) {
    throw new Error(`No se pudieron obtener datos para la llave: ${llave}`);
  }

  return data.value as Esquema;
}
