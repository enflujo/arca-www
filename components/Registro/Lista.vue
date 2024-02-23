<script setup lang="ts">
import type { LlavesRelaciones } from '~/tipos';

interface Props {
  datos?: { nombre: string; ruta?: string }[];
  titulo: string;
  relacion?: LlavesRelaciones;
  ruta?: string;
}

const props = defineProps<Props>();

const url = (elemento) => {
  if (elemento.ruta) return elemento.ruta;
  return `/${props.ruta}/${elemento[props.relacion].slug}`;
};
</script>

<template>
  <section v-if="datos && datos.length" class="seccion">
    <h3>{{ titulo }}</h3>
    <ul class="lista contenido">
      <li v-for="(elemento, i) in datos" :key="`elemento${ruta}${i}`">
        <NuxtLink :to="url(elemento)">
          {{ relacion ? elemento[relacion].nombre : elemento.nombre }}
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>

<style lang="scss" scoped>
.lista {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;

  li {
    border-right: 1px solid $rojoCerezo;
    margin: 0 0.2em 0.2em 0;
    height: fit-content;
    vertical-align: top;
    display: inline-block;

    a {
      padding: 0 0.4em;
      display: block;
      line-height: 1.1em;
    }

    &:hover {
      a,
      a:link {
        // color: $claridad;
        color: var(--rojoOxido);
      }
    }
  }

  li:nth-last-child(1) {
    border-right: 0px solid $rojoCerezo;
  }
}
</style>
