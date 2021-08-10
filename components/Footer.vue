<template>
  <footer>
    <div class="logo-completo">
      <Icono :fill="color" />
      <h2 class="logo-texto">Arca</h2>
    </div>
    <p class="copy">
      Proyecto de Jaime H. Borja Gómez (jborja@uniandes.edu.co) Departamento de Historia, Universidad de los Andes
    </p>
    <p class="copy">Bibliografía general Recursos Derivados Contacto</p>
  </footer>
</template>

<script>
export default {
  data() {
    return {
      color: '#c9c1b3',
      fecha: '',
    };
  },

  mounted() {
    this.actualizarFecha();
  },

  methods: {
    actualizarFecha() {
      setInterval(() => {
        const ahora = new Date();
        const opciones = {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        };
        this.fecha = ahora.toLocaleString('es-CO', opciones);
      }, 1000);
    },
  },
};
</script>

<style lang="scss">
@use "sass:color";

footer {
  background-color: $mediana;
  color: #c9c1b3;
  height: 168px;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 6em;
  .logo-completo {
    justify-content: center;
    align-items: center;
    .arcaIcono {
      width: 60px;
    }

    .logo-texto {
      color: #c9c1b3;
      text-transform: uppercase;
    }
  }

  .copy {
    font-size: 0.9em;
  }
}
</style>
