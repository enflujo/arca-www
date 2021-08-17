<template>
  <div>
    <template v-if="$fetchState.pending">
      <div class="contenedor">
        <div class="centrar-contenido">
          <h1>Pendiente...</h1>
        </div>
      </div>
    </template>

    <template v-else-if="$fetchState.error">
      <h1 class="error">{{ $fetchState.error.message }}</h1>
    </template>

    <template v-else>
      <div class="contenedor-general">
        <ul class="menuCategorias">
          <li v-for="cat1 in Object.keys(menu).sort()" :key="cat1" class="cat categoria1">
            {{ cat1 }}

            <ul v-if="Object.keys(menu[cat1]).length">
              <li v-for="cat2 in Object.keys(menu[cat1]).sort()" :key="cat2" class="cat categoria2">
                {{ cat2 }}

                <ul v-if="Object.keys(menu[cat1][cat2]).length">
                  <li v-for="cat3 in Object.keys(menu[cat1][cat2]).sort()" :key="cat3" class="cat categoria3">
                    {{ cat3 }}

                    <ul v-if="Object.keys(menu[cat1][cat2][cat3]).length">
                      <li v-for="cat4 in Object.keys(menu[cat1][cat2][cat3]).sort()" :key="cat4" class="cat categoria4">
                        {{ cat4 }}

                        <ul v-if="Object.keys(menu[cat1][cat2][cat3][cat4]).length">
                          <li
                            v-for="cat5 in Object.keys(menu[cat1][cat2][cat3][cat4]).sort()"
                            :key="cat5"
                            class="cat categoria5"
                          >
                            {{ cat5 }}
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>

<script>
import { gql } from 'nuxt-graphql-request';
import { crearHead } from '../../utilidades/ayudas';

export default {
  // Crea la pagina tomando como plantilla layouts/mapa.vue
  layout: 'mapa',
  data() {
    return {
      pagina: {},
      menu: {},
    };
  },

  async fetch() {
    console.log(this.$route.name);
    const query = gql`
      query {
        paginas(filter: { slug: { _eq: "${this.$route.name}" } }, limit: 1) {
          titulo
          slug
          descripcion
          contenido
          banner {
            id
            title
          }
        }

        artworks(limit: -1) {
          id
          title
          category_1_id {
            name
          }
          category_2_id {
            name
          }
          category_3_id {
            name
          }
          category_4_id {
            name
          }
          category_5_id {
            name
          }
        }
      }
    `;

    const { paginas, artworks } = await this.$graphql.principal.request(query);

    if (paginas.length && paginas[0].slug) {
      this.pagina = paginas[0];
    } else {
      if (process.server) {
        this.$nuxt.context.res.statusCode = 404;
      }
      throw new Error('La página no existe');
    }
    /**
     * menu = {
     *    Gato = {}
     * }
     *
     * work = {
     *    cat1 = 'Gato',
     *    cat2 = 'Gatito'
     * }
     *
     */
    if (artworks && artworks.length) {
      artworks.forEach((work) => {
        const cat1 = work.category_1_id ? work.category_1_id.name : null;
        const cat2 = work.category_2_id ? work.category_2_id.name : null;
        const cat3 = work.category_3_id ? work.category_3_id.name : null;
        const cat4 = work.category_4_id ? work.category_4_id.name : null;
        const cat5 = work.category_5_id ? work.category_5_id.name : null;

        if (cat1) {
          if (!this.menu[cat1]) {
            this.menu[cat1] = {};
          }

          if (cat2) {
            if (!this.menu[cat1][cat2]) {
              this.menu[cat1][cat2] = {};
            }

            if (cat3) {
              if (!this.menu[cat1][cat2][cat3]) {
                this.menu[cat1][cat2][cat3] = {};
              }

              if (cat4) {
                if (!this.menu[cat1][cat2][cat3][cat4]) {
                  this.menu[cat1][cat2][cat3][cat4] = {};
                }
                if (cat5) {
                  if (!this.menu[cat1][cat2][cat3][cat4][cat5]) {
                    this.menu[cat1][cat2][cat3][cat4][cat5] = {};
                  }
                }
              }
            }
          }
        }
      });
    }
  },

  head() {
    return crearHead(
      this.$store.state.general.datos.nombre,
      this.pagina.titulo,
      this.pagina.descripcion,
      this.pagina.banner,
      this.$nuxt.$route.path
    );
  },
};
</script>

<style lang="scss" scoped>
ul {
  margin: 0 1em;
  list-style: disc;
}

.categoria1 {
  font-size: 14px;
}

.categoria2 {
  font-size: 0.6em;
}
</style>
