import { apiBase } from '~~/config/general';

/**
 * Registra un llamado a la base de datos para resolver asincrónicamente.
 *
 * @param llave Un texto único para registrar el llamado a la base de datos.
 * @param query Query en formato Graphql.
 * @returns Devuelve el objeto asincrónico `{data, error, pending, refresh}`
 */
export default function (llave: string, query: string) {
  return useLazyAsyncData(
    llave,
    () => {
      return $fetch(`${apiBase}/graphql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
    },
    {
      transform: (data: any) => data.data,
      server: false,
    }
  );
}
