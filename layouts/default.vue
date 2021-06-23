<template>
  <div id="contenedor">
    <Navegacion :colorIcono="colorIcono" @cerrarMenu="cerrarMenu" />
<<<<<<< HEAD
    <!-- <Menu :colorFondo="general.project_color" :menuAbierto="menuAbierto" @resolverMenu="resolverMenu" /> -->
    <Menu :menuAbierto="menuAbierto" @resolverMenu="resolverMenu" />
    <main role="main">
      <Fondo />
      <div class="contenedor">
        <div class="centrar-contenido">
          <Nuxt keepAlive />
        </div>
=======
    <Menu :colorFondo="general.project_color" :menuAbierto="menuAbierto" @resolverMenu="resolverMenu" />
    <main role="main" class="fondo-general">
      <div class="centrar-contenido">
        <Nuxt keepAlive />
>>>>>>> 4a14513 (Adelantos minimos del CSS)
      </div>
    </main>
    <!-- <Footer /> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      colorIcono: '#FFF',
      menuAbierto: false,
    };
  },

  computed: {
    general() {
      return this.$store.state.general.datos;
    },
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

<style lang="scss" scoped>
@use "sass:color";
<<<<<<< HEAD

=======
@font-face {
  font-family: 'Agraham';
  src: local('Agraham'), local('Agraham Personal Use');
}
>>>>>>> 4a14513 (Adelantos minimos del CSS)
#contenedor {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  color: $profundidad;
}
.division {
  display: block;
  background-color: $profundidad;
  width: 30%;
  height: 100%;
  position: absolute;
  left: 70%;
  top: 0;
}

main {
  // margin-top: $anchoMenu;
  flex-grow: 1;
  // background-color: color.scale($colorPrincipal, $lightness: 90%);
}

// Teléfonos horizontal
@media (min-width: $minCelular) {
}

// Pantallas medianas (Tablets)
@media (min-width: $minTablet) {
  main {
    // width: calc(100vw - #{$anchoMenu});
  }
}

// Dispositivos grandes y pantallas medianas
@media (min-width: $minPantalla) {
}

// Pantallas grandes
@media (min-width: $minPantallaGrande) {
}
</style>
