<template>
  <footer :class="`${completo ? 'completo' : 'pequeno'}`">
    <div class="logo-completo">
      <Icono :fill="color" />
      <h2 class="logo-texto">Arca</h2>
    </div>
    <div class="texto-f-uno">
      <p class="copy">
        {{ informacionFooter.footer_autor }} <br />
        {{ informacionFooter.footer_email }} <br />
        {{ informacionFooter.footer_institucion }} <br />
        {{ informacionFooter.footer_lugar }}
      </p>
    </div>
    <div class="texto-f-dos">
      <p class="copy">Bibliografía general <br />Recursos derivados <br />Contacto</p>
    </div>
  </footer>
</template>

<script>
import { gql } from 'nuxt-graphql-request';
export default {
  props: {
    completo: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      color: '#fffdf8',
      fecha: '',
      informacionFooter: {},
    };
  },
  async fetch() {
    const query = gql`
      query {
        general {
          footer_autor
          footer_email
          footer_institucion
          footer_lugar
        }
      }
    `;
    const { general } = await this.$graphql.principal.request(query);
    if (general) {
      this.informacionFooter = general;
    } else {
      if (process.server) {
        this.$nuxt.context.res.statusCode = 404;
      }
      throw new Error('Datos no encontrados');
    }
  },
};
</script>

<style lang="scss">
@use 'sass:color';
footer {
  background-color: $dolor;
  color: $claridad;
  height: 14vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  position: relative;

  .logo-completo {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 10vh;
    margin-left: 1vh;
    .logo-texto {
      color: $claridad;
      text-transform: uppercase;
      font-family: $fuentePrincipal;
      font-size: 3vh;
    }
  }
  .texto-f-uno {
    display: flex;
    width: 350px;
    text-align: center;
  }
  .texto-f-dos {
    display: flex;
    width: 150px;
    text-align: center;
  }
  .copy {
    font-size: 1.5vh;
  }
}

.pequeno {
  width: calc(100% - 15vw);
  left: 15vw;
}
</style>
