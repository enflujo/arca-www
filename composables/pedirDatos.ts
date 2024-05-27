import { apiBase } from '~/config/general';

export default async <Esquema>(query: string) => {
  return new Promise(async (resolver, rechazar) => {
    const respuesta = await $fetch<{ data: any }>(`${apiBase}/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    }).catch((error) => {
      console.log('¡ERROR!', error.data.errors[0].extensions.errors[0]);
    });

    if (respuesta?.data) {
      resolver(respuesta?.data);
    }
  });
};
