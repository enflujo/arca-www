<template>
  <footer>
    <div class="logo-completo">
      <Icono :fill="color" />
      <h2 class="logo-texto">Arca</h2>
    </div>
    <div class="texto-f-uno">
      <p class="copy">
        Proyecto de Jaime H. Borja Gómez (jborja@uniandes.edu.co) Departamento de Historia, Universidad de los Andes
      </p>
    </div>
    <div class="texto-f-dos">
      <p class="copy">Bibliografía general Recursos Derivados Contacto</p>
    </div>
  </footer>
</template>

<script>
export default {
  data() {
    return {
      color: '#fffdf8',
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
  background-color: $dolor;
  color: $claridad;
  height: 120px;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  position: relative;
  .logo-completo {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .arcaIcono {
      width: 60px;
    }

    .logo-texto {
      color: $claridad;
      text-transform: uppercase;
    }
  }
  .texto-f-uno {
    display: flex;
    width: 300px;
    text-align: center;
  }
  .texto-f-dos {
    display: flex;
    width: 150px;
    text-align: center;
  }
  .copy {
    font-size: 0.9em;
  }
}
</style>
