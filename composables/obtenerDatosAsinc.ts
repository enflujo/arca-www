import { apiBase } from '~/config/general';

/**
 * Registra un llamado a la base de datos para resolver asincrónicamente.
 *
 * @param llave Un texto único para registrar el llamado a la base de datos.
 * @param query Query en formato Graphql.
 * @returns Devuelve el objeto asincrónico `{data, error, status, refresh}`
 */
export default function <Esquema>(llave: string, query: string) {
  let Query = query;

  const {
    data,
    error,
    status,
    refresh: recargar,
  } = useLazyAsyncData<Esquema>(
    llave,
    () => {
      return $fetch(`${apiBase}/graphql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: Query }),
      });
    },
    {
      transform: (data: any) => data.data,
      server: false,
    }
  );

  function refresh(query: string) {
    Query = query;
    recargar();
  }

  watch(
    () => error,
    (err) => {
      console.log(JSON.stringify(err, null, 2));
    }
  );

  return { data, error, status, refresh };
}
