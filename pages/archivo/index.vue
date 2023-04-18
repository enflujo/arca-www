<script setup>
import { gql } from '~~/utilidades/ayudas';

const ruta = useRoute();

const { paginas } = await obtenerDatos(
  'indiceArchivo',
  gql`
    query {
      paginas(filter: { slug: { _eq: "archivo" } }, limit: 1) {
        titulo
        slug
        descripcion
        contenido
        banner {
          id
          title
        }
      }
    }
  `
);

useHead(elementosCabeza(paginas[0] ? paginas[0] : {}, ruta.path));

const pagina = ref(null);
pagina.value = paginas[0];

const Obras = gql`
  query {
    obras(limit: -1, sort: ["fecha_inicial"]) {
      id
      fecha_inicial
      fecha_final
    }
  }
`;
// const Obras = gql`
//   query {
//     obras_aggregated(groupBy: ["fecha_inicial"], sort: ["fecha_inicial"]) {
//       group
//       count {
//         id
//       }
//     }
//   }
// `;

const { data, pending } = obtenerDatosAsinc('todasLineaTiempo', Obras);

const fechaInicial = ref(0);
const fechaFinal = ref(0);
const obrasOrdenadas = ref([]);
const max = ref(0);

watch(data, ({ obras }) => {
  // console.log(
  //   obras_aggregated.map((grupo) => {
  //     return { cantidad: grupo.count.id, fecha: grupo.group.fecha_inicial };
  //   })
  // );

  // respuesta.
  let fechaMax = 0;
  const respuesta = {};
  let cielo = 0;

  obras.forEach(({ id, fecha_inicial, fecha_final }) => {
    if (fecha_final && fecha_final > fechaMax) {
      fechaMax = fecha_final;
    }

    if (!respuesta[fecha_inicial]) {
      respuesta[fecha_inicial] = [];
    }

    respuesta[fecha_inicial].push({ id, fecha_inicial, fecha_final });

    if (respuesta[fecha_inicial].length > cielo) {
      cielo = respuesta[fecha_inicial].length;
    }
  });

  fechaInicial.value = obras[0].fecha_inicial;
  fechaFinal.value = fechaMax;
  max.value = cielo;
  obrasOrdenadas.value = respuesta;
});

// Nuxt normaliza los nombres de "layouts" a kebab-case.
definePageMeta({ layout: 'archivo', keepalive: true });
</script>

<template>
  <h1>{{ pagina.titulo }}</h1>

  <Cargador v-if="pending" />

  <div v-else>
    <VistaLineaTiempo :fechaInicial="fechaInicial" :fechaFinal="fechaFinal" :datos="obrasOrdenadas" :max="max" />
  </div>
</template>

<style lang="scss" scoped></style>
