<template>
  <div id="contenedor">
    <Menu :menuAbierto="menuAbierto" @resolverMenu="resolverMenu" @cerrarMenu="cerrarMenu" />

    <main role="main">
      <MenuBuscador />

      <Nuxt keepAlive />
      <FooterPequeno />
    </main>
  </div>
</template>

<script>
import FooterPequeno from '~/components/FooterPequeno.vue';
export default {
  components: { FooterPequeno },
  data() {
    return {
      colorIcono: '#FFF',
      menuAbierto: false,
    };
  },

  methods: {
    /**
     * Intercambia el estado del menú: si esta abierto lo cierra, si esta cerrado lo abre.
     */
    resolverMenu() {
      this.menuAbierto = !this.menuAbierto;
    },

    /**
     * Cierra el menú, lo usamos en navegación si el menú esta abierto.
     */
    cerrarMenu() {
      if (this.menuAbierto) {
        this.menuAbierto = false;
      }
    },
  },
};
</script>

<style lang="scss">
@use "sass:color";

@font-face {
  font-family: 'Agraham';
  src: local('Agraham'), local('Agraham Personal Use');
}

main {
  display: flex;
  flex-direction: column;
}

#contenedor {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  color: $profundidad;
}

.contenedor {
  display: flex;
}

// Teléfonos horizontal
@media (min-width: $minCelular) {
}

// Pantallas medianas (Tablets)
// @media (min-width: $minTablet) {
// }

// Dispositivos grandes y pantallas medianas
@media (min-width: $minPantalla) {
}

// Pantallas grandes
@media (min-width: $minPantallaGrande) {
}
</style>
