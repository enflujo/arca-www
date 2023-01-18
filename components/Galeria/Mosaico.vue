<script setup>
import { urlImagen } from '~~/utilidades/ayudas';

const props = defineProps({
  obras: Array,
});
</script>

<template>
  <div class="contenedorGaleria">
    <div v-for="obra in obras" :key="obra.registro" class="obra">
      <span class="registro">{{ obra.registro }}</span>

      <NuxtLink :to="`/archivo/obras/${obra.registro}`" class="enlaceObra">
        <img class="imagen" :src="urlImagen(obra.imagen.id, 'galeria')" :alt="obra.titulo" />
      </NuxtLink>

      <div class="infoImagen">
        <NuxtLink :to="`/archivo/obras/${obra.registro}`">
          <h3 class="titulo">{{ obra.titulo }}</h3>
        </NuxtLink>

        <NuxtLink v-if="obra.autores.length" class="autor" :to="`/archivo/autores/${obra.autores[0].autores_id.id}`">
          {{ obra.autores[0].autores_id.nombre }} {{ obra.autores[0].autores_id.apellido }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.contenedorGaleria {
  width: 85vw;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 0 2em;
}

.obra {
  display: flex;
  flex-direction: column;
  min-width: 250px;
  margin: 0.5em;
  padding: 0;
  position: relative;
}

.enlaceObra {
  background-color: black;
}

.registro {
  background-color: $amarilloBase;
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.5em 1em;
  font-size: 0.8em;
}

.imagen {
  width: auto;
  max-height: 200px;
  text-align: center;
  margin: 0 auto;
  display: block;
}

.infoImagen {
  color: black;
  background-color: $amarilloBase;
  text-align: left;
  padding: 0.8em;
  font-size: 0.85em;

  .titulo {
    font-size: 1em;
    font-weight: normal;
    max-width: 250px;
  }
  .autor {
    margin-top: 1.2em;
    font-size: 0.85em;
    font-weight: bold;
  }
}
</style>
