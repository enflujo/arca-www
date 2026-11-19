<script setup lang="ts">
import type { ObraGaleria } from '~/tipos';
// POR HACER: imagen predeterminada si no hay imagen
interface Props {
  obras: ObraGaleria[];
  pagina: number;
  cargarPagina?: (pagina: number) => void;
  cargando?: boolean;
}

const props = withDefaults(defineProps<Props>(), { cargando: false, pagina: 1 });
const siguientePagina: Ref<HTMLDivElement | undefined> = ref();
const claseCargando = ref(false);

onMounted(() => {
  if (props.pagina && siguientePagina.value) {
    duranteInterseccion(
      siguientePagina.value,
      () => {
        if (!props.cargarPagina) return;
        props.cargarPagina(props.pagina + 1);
      },
      false
    );
  }
});

watch(
  () => props.cargando,
  (nuevoValor) => {
    claseCargando.value = nuevoValor ?? false;
  }
);
</script>

<template>
  <div class="contenedorGaleria">
    <div v-for="obra in obras" :key="`obra-registro-${obra.registro}`" class="obra">
      <span class="registro">{{ obra.registro }}</span>

      <NuxtLink :to="`/obras/${obra.registro}`">
        <ImagenArca v-if="obra.imagen" class="imagen" :datos="obra.imagen" :titulo="obra.titulo" llave="galeria" />
      </NuxtLink>

      <div class="infoImagen">
        <h3 class="titulo">
          <NuxtLink :to="`/obras/${obra.registro}`">
            {{ obra.titulo }}
          </NuxtLink>
        </h3>

        <NuxtLink
          v-if="obra.autores.length"
          v-for="autor in obra.autores"
          :key="`autor${autor.autores_id.id}`"
          class="autor"
          :to="`/autores/${autor.autores_id.id}`"
        >
          {{ autor.autores_id.nombre }} {{ autor.autores_id.apellido }}
        </NuxtLink>
      </div>
    </div>
  </div>

  <div
    v-if="pagina"
    ref="siguientePagina"
    class="siguientePagina"
    :class="claseCargando ? 'activo' : ''"
    suppressHydrationWarning
  >
    <p class="textoCargando">{{ `Cargando página ${pagina + 1}` }}</p>
  </div>
</template>

<style lang="scss" scoped>
.contenedorGaleria {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  background-color: var(--amarilloPetalo);
}

// Tarjeta de obra: papel con borde, como las tarjetas del rediseño.
.obra {
  min-width: 250px;
  margin: 0 1em 1em 0;
  padding: 8px;
  position: relative;
  background-color: var(--papel);
  border: 1px solid var(--borde);
  border-radius: 12px;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  .registro {
    position: absolute;
    top: 14px;
    right: 14px;
    padding: 0.2em 0.7em;
    font-size: 0.75em;
    font-weight: 600;
    color: var(--ocre);
    background-color: var(--papel);
    border: 1px solid var(--borde);
    border-radius: 999px;
  }

  .infoImagen {
    color: var(--tinta);
    text-align: left;
    padding: 0.8em;
    font-size: 0.85em;

    a,
    a:link {
      color: var(--tinta);
    }

    .titulo {
      font-family: var(--fuenteSerif);
      font-size: 1.2em;
      font-weight: normal;
      line-height: 1.2;
      max-width: 250px;
    }
    .autor {
      margin-top: 0.6em;
      font-size: 0.85em;
      font-weight: 600;

      a,
      a:link {
        color: var(--ocre);
      }

      &:hover {
        color: var(--ocreClaro);
      }
    }
  }

  &:hover {
    border-color: var(--ocre);
    box-shadow: 0 6px 18px rgba(60, 44, 28, 0.14);
  }
}

.imagen {
  width: inherit;
  max-height: 200px;
  max-width: 100%;
  margin: 0 auto;
  display: block;
}

.siguientePagina {
  flex-basis: 100%;
  margin-top: 1em;
  background-color: $dolor;
  padding: 1em;
  text-align: center;
  opacity: 0;

  &.activo {
    opacity: 1;
    animation: palpito 0.5s alternate infinite;
  }

  .textoCargando {
    color: $amarilloClaro;
    font-style: italic;
    font-weight: bold;

    &::before,
    &::after {
      content: '';
      background-image: url(/arca-icono-amarillo.svg);
      background-repeat: no-repeat;
      width: 20px;
      height: 20px;
      display: inline-block;
      vertical-align: middle;
      margin: 0 1em;
    }
  }

  .iconoCargador {
    width: 28px;
    display: inline-block;
    vertical-align: middle;
  }
}

@keyframes palpito {
  from {
    opacity: 0.5;
  }
  to {
    opacity: 1;
  }
}
</style>
