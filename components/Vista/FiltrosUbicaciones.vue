<script setup lang="ts">
import type { TiposLugares } from '~/tipos';

interface Props {
  cambiarDatos: (tipoLugar: TiposLugares) => Promise<void>;
  coleccion: string;
}
defineProps<Props>();

const opciones: { coleccion: TiposLugares; titulo: string }[] = [
  { coleccion: 'paises', titulo: 'Países' },
  { coleccion: 'ciudades', titulo: 'Ciudades' },
  { coleccion: 'ubicaciones', titulo: 'Ubicaciones' },
];
</script>

<template>
  <ul class="opciones">
    <li
      v-for="opcion in opciones"
      :key="`opcion-ubicacion${opcion.coleccion}`"
      @click="cambiarDatos(opcion.coleccion)"
      class="opcionUbicacion"
      :class="coleccion === opcion.coleccion ? 'activo' : ''"
    >
      {{ opcion.titulo }}
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.opciones {
  display: flex;
  align-items: flex-start;
  margin-top: 3px;
}
.opcionUbicacion {
  padding: 0.3em;
  cursor: pointer;
  margin-right: 0.5em;
  background-color: $amarilloBase;
  transition: all 0.25s ease-in-out;

  &:hover {
    background-color: $amarilloClaro;
  }
  &.activo {
    background-color: $dolor;
    color: $mediana;

    &:hover {
      cursor: default;
      background-color: $dolor;
      color: $mediana;
    }
  }
}
</style>
