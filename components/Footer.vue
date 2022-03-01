<template>
  <footer :class="`${completo ? 'completo' : 'pequeno'}`">
    <div class="logo-completo">
      <Icono :fill="color" />
      <h2 class="logo-texto">Arca</h2>
    </div>
    <div class="texto-f-uno">
      <p class="copy">
        Proyecto de Jaime H. Borja Gómez (jborja@uniandes.edu.co) <br />
        Departamento de Historia, Universidad de los Andes <br />Bogotá, Colombia
      </p>
    </div>
    <div class="texto-f-dos">
      <p class="copy">Bibliografía general <br />Recursos derivados <br />Contacto</p>
    </div>
  </footer>
</template>

<script>
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
    };
  },
};
</script>

<style lang="scss">
@use 'sass:color';
footer {
  background-color: $dolor;
  color: $claridad;
  height: 120px;
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
    .arcaIcono {
      width: 60px;
    }
    .logo-texto {
      color: $claridad;
      text-transform: uppercase;
      font-family: $fuentePrincipal;
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
    font-size: 0.9em;
  }
}

.pequeno {
  width: calc(100% - 280px);
  left: 280px;
}
</style>
