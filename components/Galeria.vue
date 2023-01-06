<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { urlImagen } from '~~/utilidades/ayudas';
import { nombrePorSlug, obrasPorSlug } from '~~/utilidades/queries';

const props = defineProps({
  coleccion: String,
  enTablaRelacional: {
    type: Boolean,
    default: false,
  },
});

/**
 * Operaciones en el servidor
 */
const ruta = useRoute();
const datos = ref(null);
const respuesta = await obtenerDatos(props.coleccion, nombrePorSlug(props.coleccion, ruta.params.slug));

useHead(elementosCabeza(respuesta[props.coleccion][0], ruta.path)); // SEO

datos.value = respuesta[props.coleccion][0];

/**
 * Operaciones en el cliente
 */
const obras = ref([]);
const cerebroArchivo = usarArchivo();

const { data, pending } = obtenerDatosAsinc(
  `obras-${datos.value.id}`,
  obrasPorSlug(props.coleccion, ruta.params.slug, props.enTablaRelacional)
);

onMounted(() => {
  cerebroArchivo.paginaActual = props.coleccion;
});

watch(data, (datosObras) => {
  // Extraer las obras de colección directamente o de la tabla relacional.
  obras.value = !props.enTablaRelacional
    ? datosObras[props.coleccion][0].obras
    : datosObras[props.coleccion][0].obras.map((obra) => obra.obras_id);
});
</script>

<template>
  <h1>{{ datos.nombre }}</h1>
  <Cargador v-if="pending" />

  <div v-else class="contenedorGaleria">
    <div v-for="obra in obras" :key="obra.id" class="obra">
      <span class="registro">{{ obra.registro }}</span>

      <NuxtLink :to="`/archivo/obras/${obra.id}`" class="enlaceObra">
        <img class="imagen" :src="urlImagen(obra.imagen.id, 'galeria')" :alt="obra.titulo" />
      </NuxtLink>

      <div class="infoImagen">
        <NuxtLink :to="`/archivo/obras/${obra.id}`">
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
