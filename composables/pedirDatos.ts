import { apiBase } from '~/config/general';

// export default async <Esquema>(query: string, sistema = false): Promise<Esquema> => {
//   return new Promise(async (resolver, rechazar) => {
//     const respuesta = await $fetch<{ data: any }>(`${apiBase}/graphql${sistema ? '/system' : ''}`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ query }),
//     }).catch((error) => {
//       throw createError({
//         statusCode: 500,
//         statusMessage: error.message,
//       });
//       rechazar(error);
//     });

//     if (respuesta?.data) {
//       resolver(respuesta.data as Esquema);
//     }
//   });
// };

export default async <Esquema>(query: string, sistema = false): Promise<Esquema> => {
  return $fetch(`${apiBase}/graphql${sistema ? '/system' : ''}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  })
    .then((res: any) => res.data as Esquema)
    .catch((error) => {
      throw createError({
        message: error.message,
      });
    });
};
