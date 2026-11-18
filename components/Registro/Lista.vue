<script setup lang="ts">
import type { LlavesRelaciones } from '~/tipos';

interface Props {
  datos?: { nombre: string; ruta?: string }[];
  titulo: string;
  relacion?: LlavesRelaciones;
  ruta?: string;
  /** Los elementos forman una jerarquía (tema › subtema…), como la Clasificación. */
  jerarquia?: boolean;
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
    <ul class="lista contenido" :class="{ jerarquia }">
      <li v-for="(elemento, i) in datos" :key="`elemento${ruta}${i}`">
        <span v-if="jerarquia && i > 0" class="flecha" aria-hidden="true">›</span>
        <NuxtLink :to="url(elemento)" class="pildora" :class="{ principal: jerarquia && i === 0 }">
          {{ relacion ? elemento[relacion].nombre : elemento.nombre }}
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>

<style lang="scss" scoped>
// Rediseño 2026: cada valor es una píldora enlazada (antes, palabras separadas por barras).
.lista {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 4px;

  li {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
}

.pildora {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 1px 10px;
  border: 1px solid var(--borde);
  border-radius: 999px;
  background-color: var(--papel);
  font-size: 0.9em;
  line-height: 1.2;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;

  &:link,
  &:visited {
    color: var(--tinta);
  }

  &:hover {
    border-color: var(--ocre);
    color: var(--ocre);
  }
}

// Clasificación: la ruta tema › subtema resaltada.
.jerarquia {
  gap: 4px 5px;

  .pildora {
    border-color: transparent;
    background-color: var(--arena);
    font-weight: 600;

    &:link,
    &:visited {
      color: var(--ocreOscuro);
    }

    &:hover {
      background-color: var(--ocre);
      color: var(--papel);
    }

    &.principal {
      min-height: 26px;
      padding: 1px 12px;
      background-color: var(--ocre);
      font-family: var(--fuenteSerif);
      font-size: 1.05em;
      font-weight: 400;

      &:link,
      &:visited {
        color: var(--papel);
      }

      &:hover {
        background-color: var(--ocreOscuro);
      }
    }
  }

  .flecha {
    font-size: 1.2em;
    color: var(--ocre);
  }
}
</style>
