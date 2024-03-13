<script setup lang="ts">
import Cargador from '~/components/Cargador.vue';
import { gql } from '~/utilidades/ayudas';

interface EsquemaBasico {
  titulo: string;
}

const BaseArchivo = gql`
  query {
    paginas(filter: { slug: { _eq: "archivo" } }) {
      titulo
    }
  }
`;

const { paginas } = await obtenerDatos<{ paginas: EsquemaBasico[] }>('base-archivo', BaseArchivo);

const datosBasicos = paginas[0];

definePageMeta({ layout: 'archivo' });

/** EN CLIENTE */
const datos = ref({
  totalObras: 0,
});

interface IDatosIniciales {
  obras_aggregated: {
    count: { id: number };
  }[];
}

const DatosIniciales = gql`
  query {
    obras_aggregated {
      count {
        id
      }
    }
  }
`;

const { data, pending } = obtenerDatosAsinc<IDatosIniciales>('inicio-archivo', DatosIniciales);

watch(data, (respuesta) => {
  if (!respuesta?.obras_aggregated) return;

  datos.value.totalObras = respuesta.obras_aggregated[0].count.id;
});
</script>
<template>
  <h1>{{ datosBasicos.titulo }}</h1>

  <Cargador v-if="pending"></Cargador>
  <GraficaContador v-else :numeroObras="datos.totalObras" />
</template>
