<template>
  <div class="pagina">
    <Cargador v-if="$fetchState.pending" />

    <div v-else-if="$fetchState.error">
      <h1 class="error">{{ $fetchState.error.message }}</h1>
    </div>

    <div v-else class="contenido">
      <Mapa :datos="ubicaciones" />
    </div>
  </div>
</template>

<script>
import { gql } from 'nuxt-graphql-request';

export default {
  layout: 'conBuscador',
  data() {
    return {
      ubicaciones: [],
    };
  },

  async fetch() {
    const query = gql`
      query {
        ubicacion {
          id
          nombre
          lat
          lon
        }
      }
    `;

    const { ubicacion } = await this.$graphql.principal.request(query);

    if (ubicacion.length) {
      this.ubicaciones = ubicacion;
    }
  },
};
</script>

<style lang="scss" scoped></style>
