import { apiBase } from '~~/config/general';

/**
 * Hace llamado a la base de datos de Directus en Graphql.
 *
 * @param llave Un texto único para registrar el llamado a la base de datos.
 * @param query Query en formato Graphql.
 * @returns Devuelve los datos in nivel dentro: `data.data`
 */
export default async function (llave: string, query: string) {
  const { data, error } = await useAsyncData(
    llave,
    () => {
      // console.log('EN SERVIDOR', query)
      return $fetch(`${apiBase}/graphql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
    },
    {
      transform: (data: any) => data.data,
    }
  );

  if (error.value) {
    throw new Error(JSON.stringify(error.value, null, 2));
  }

  return data.value;
}
