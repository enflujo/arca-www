<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql, obtenerDatos, urlImagen } from '~~/utilidades/ayudas';

const cargando = ref(true);
const datosRelato = ref(null);
const datosObras = ref(null);
const cerebroArchivo = usarArchivo();
const ruta = useRoute();

definePageMeta({ layout: 'con-buscador', keepalive: true });

onMounted(async () => {
  cerebroArchivo.paginaActual = 'relatos';
  const Relato = gql`
  query {
    relatos_visuales(filter: { slug: { _eq: "${ruta.params.relato}" } }, limit: 1) {
      nombre,
      obras {
        titulo,
        imagen {
          id,
          title
        },
        autores {
          autores_id {
            nombre,
            apellido
          }
        }
      }
    }
  }
  `;
  const { relatos_visuales } = await obtenerDatos(Relato);

  datosRelato.value = relatos_visuales[0];
  datosObras.value = datosRelato.value.obras;

  cargando.value = false;
});
</script>

<template>
  <Cargador v-if="cargando" />
  <div v-if="datosRelato">
    <h1>{{ datosRelato.nombre }}</h1>
    <div class="contenedorGaleria">
      <div v-for="obra in datosObras" :key="obra.id">
        <!-- <p>
        <span style="font-weight: bold">{{ obra.titulo }}</span
        >, {{ obra.autores[0].autores_id.nombre }} {{ obra.autores[0].autores_id.apellido }}
      </p> -->

        <img class="imagenGaleria" :src="urlImagen(obra.imagen.id, 'galeria')" :alt="obra.title" />
      </div>
    </div>
  </div>
</template>
