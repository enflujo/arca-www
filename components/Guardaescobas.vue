<script setup>
import { usarGeneral } from '@/cerebros/general';

const general = usarGeneral();

const props = defineProps({
  completo: {
    type: Boolean,
    default: true,
  },
});
</script>

<template>
  <footer :class="`${completo ? 'completo' : 'pequeno'}`">
    <div class="texto-f-uno">
      <span class="copy" v-html="general.guardaescobas"></span>
    </div>
    <!-- <div class="texto-f-dos">
      <p>Bibliografía general <br />Recursos derivados <br />Contacto</p>
    </div> -->
  </footer>
</template>

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
  bottom: 0;
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
}

.pequeno {
  width: calc(100% - 15vw);
  left: 15vw;
}
</style>
