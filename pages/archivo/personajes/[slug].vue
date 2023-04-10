<script setup>
import { usarArchivo } from '~/cerebros/archivo';
import { gql } from '~/utilidades/ayudas';
import { obrasPorSlug } from '~/utilidades/queries';
const ruta = useRoute();
const datosGenerales = ref([]);
const cerebroArchivo = usarArchivo();
const obras = ref([]);
definePageMeta({ layout: 'archivo', keepalive: true });

const queryPersonaje = gql`
query {
  personajes(filter: { slug: {_eq: "${ruta.params.slug}"} }) {
    nombre
    descripcion
    fuente
    muerte
    muerte_anotacion
    beatificacion_canonizacion_desde
    beatificacion_canonizacion_desde_anotacion
    beatificacion_canonizacion_hasta
    beatificacion_canonizacion_hasta_anotacion
    obras_func {
      count
    }
  }
}
`;

const respuesta = await obtenerDatos(`personaje${ruta.params.slug}`, queryPersonaje);
datosGenerales.value = respuesta.personajes[0];
console.log(datosGenerales.value);
const { data, pending } = obtenerDatosAsinc(
  `personajeObras${ruta.params.slug}`,
  obrasPorSlug('personajes', ruta.params.slug, true)
);

watch(data, ({ personajes }) => {
  obras.value = personajes[0].obras.map((obra) => obra.obras_id);
});
</script>

<template>
  <h1>Personaje - {{ datosGenerales.nombre }}</h1>

  <Cargador v-if="pending" />
  <div v-else>
    <GraficaContador :numeroObras="datosGenerales.obras_func.count" />
    <p v-if="datosGenerales.descripcion" class="info">
      <span class="infoTitulo">Descripción: </span><span v-html="datosGenerales.descripcion"></span>
    </p>

    <p v-if="datosGenerales.fuente" class="info">
      <span class="infoTitulo">Fuente:</span><span v-html="datosGenerales.fuente"></span>
    </p>
    <p v-if="datosGenerales.muerte" class="info">
      <span class="infoTitulo">Muerte:</span> {{ datosGenerales.muerte }} {{ datosGenerales.muerte_anotacion }}
    </p>
    <p v-if="datosGenerales.beatificacion_canonizacion_desde">
      <span class="infoTitulo">Beatificación-canonización desde:</span>
      {{ datosGenerales.beatificacion_canonizacion_desde }}
      {{ datosGenerales.beatificacion_canonizacion_desde_anotacion }}
    </p>
    <p v-if="datosGenerales.beatificacion_canonizacion_hasta">
      <span class="infoTitulo">Beatificación-canonización hasta:</span>
      {{ datosGenerales.beatificacion_canonizacion_hasta }}
      {{ datosGenerales.beatificacion_canonizacion_hasta_anotacion }}
    </p>

    <GaleriaMosaico :obras="obras" />
  </div>
</template>

<style lang="scss" scoped>
.info {
  font-family: var(--fuenteParrafos);
  margin: 0.5em 0;
  text-align: justify;
}
.infoTitulo {
  font-weight: bold;
}
</style>
