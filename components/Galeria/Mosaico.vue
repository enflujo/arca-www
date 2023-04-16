<script setup>
const props = defineProps({
  obras: Array,
  pagina: Number,
  cargarPagina: Function,
  cargando: Boolean,
});

const siguientePagina = ref(null);

onMounted(() => {
  duranteInterseccion(
    siguientePagina.value,
    () => {
      props.cargarPagina(props.pagina + 1);
    },
    false
  );
});
</script>

<template>
  <div class="contenedorGaleria">
    <div v-for="obra in obras" :key="obra.registro" class="obra">
      <span class="registro">{{ obra.registro }}</span>

      <NuxtLink :to="`/archivo/obras/${obra.registro}`">
        <ImagenArca class="imagen" :datos="obra.imagen" :titulo="obra.titulo" llave="galeria" />
      </NuxtLink>

      <div class="infoImagen">
        <h3 class="titulo">
          <NuxtLink :to="`/archivo/obras/${obra.registro}`">
            {{ obra.titulo }}
          </NuxtLink>
        </h3>

        <NuxtLink v-if="obra.autores.length" class="autor" :to="`/archivo/autores/${obra.autores[0].autores_id.id}`">
          {{ obra.autores[0].autores_id.nombre }} {{ obra.autores[0].autores_id.apellido }}
        </NuxtLink>
      </div>
    </div>
    <div class="siguientePagina" ref="siguientePagina">{{ cargando ? `Cargando página ${props.pagina}...` : '' }}</div>
  </div>
</template>

<style lang="scss" scoped>
.contenedorGaleria {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  background-color: var(--amarilloPetalo);

  &::after {
    content: '';
    flex: auto;
  }
}

.obra {
  min-width: 250px;
  margin: 0 1em 1em 0;
  padding: 7px;
  position: relative;
  background-color: var(--amarilloBase);

  .registro {
    position: absolute;
    top: 0;
    right: 0;
    padding: 0.5em 1em;
    font-size: 0.8em;
    color: black;
    background-color: var(--amarilloBase);
  }

  .infoImagen {
    color: black;
    text-align: left;
    padding: 0.8em;
    font-size: 0.85em;

    a,
    a:link {
      color: var(--profundidad);
    }

    .titulo {
      font-size: 1em;
      font-weight: normal;
      max-width: 250px;
    }
    .autor {
      margin-top: 1.2em;
      font-size: 0.85em;
      font-weight: bold;

      &:hover {
        color: var(--amarilloBase);
      }
    }
  }

  &:hover {
    background-color: var(--verdeEsmeralda3);

    .registro {
      background-color: var(--verdeEsmeralda2);
      color: var(--claridad);
    }

    .infoImagen {
      a {
        color: var(--claridad);
      }
    }
  }
}

.imagen {
  width: inherit;
  max-height: 200px;
  margin: 0 auto;
  display: block;
}

.siguientePagina {
  flex-basis: 100%;
  margin-top: 1em;
  background-color: red;
  color: white;
  padding: 1em;
  text-align: center;
}
</style>
