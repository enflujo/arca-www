<script setup>
import { urlImagen } from '~~/utilidades/ayudas';

defineProps({
  obras: Array,
});
</script>

<template>
  <div class="contenedorGaleria">
    <div v-for="obra in obras" :key="obra.id" class="obra">
      <nuxt-link :to="`/`">
        <img class="imagen" :src="urlImagen(obra.imagen.id, 'galeria')" :alt="obra.titulo" />
        <div class="infoImagen">
          <p class="titulo">{{ obra.titulo }}</p>
          <p class="autor">{{ obra.autores[0].autores_id.nombre }} {{ obra.autores[0].autores_id.apellido }}</p>
        </div>
      </nuxt-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.contenedorGaleria {
  width: 85vw;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  background-color: black;
}

.obra {
  display: block;
  width: min-content;
  min-width: 250px;
  margin: 0.25em;
  padding: 0.25em;
}

.imagen {
  width: auto;
  height: 200px;
  text-align: center;
  margin: 0 auto;
  display: block;
}

.infoImagen {
  color: white;
  text-align: center;
  margin-top: 0.2em;

  .titulo {
    font-style: italic;
  }

  .titulo::after {
  }
}
</style>
