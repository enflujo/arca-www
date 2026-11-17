import { apiBase } from '~/config/general';

/**
 * Registra un llamado a la base de datos para resolver asincrónicamente.
 *
 * @param llave Un texto único para registrar el llamado a la base de datos.
 * @param query Query en formato Graphql.
 * @returns Devuelve el objeto asincrónico `{data, error, pending, refresh}`
 */
export default function <Esquema>(llave: string, query: string) {
  let Query = query;

  const asincrono = useLazyAsyncData<Esquema>(
    llave,
    () => {
      // console.log(Query);
      return $fetch(`${apiBase}/graphql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: Query }),
      });
    },
    {
      transform: (data: any) => data?.data || null,
      // También en el servidor: así los índices y galerías traen sus enlaces y obras en el HTML (SEO).
      server: true,
    }
  );
  const { data, error, pending, refresh: recargar } = asincrono;

  /** Promesa que se cumple cuando llegan los datos (para esperarlos en el servidor). */
  const listo = Promise.resolve(asincrono).then(() => data.value);

  function refresh(query: string) {
    Query = query;
    recargar();
  }

  watch(error, (err) => {
    if (err) {
      console.log(JSON.stringify(err, null, 2));
    }
  });

  return { data, error, pending, refresh, listo };
}
