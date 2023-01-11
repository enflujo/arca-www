<script setup>
import { gql } from '~~/utilidades/ayudas';

const props = defineProps({
  datos: Object,
  coleccion: String,
  abierto: Boolean,
  cerrarCajon: Function,
});
const datosColeccion = ref('');

function crearQuery() {
  return gql`
    query {
      ${props.coleccion}_by_id(id: ${props.datos.id}) {
        ${props.coleccion === 'paises' ? 'slug' : 'id'}
        nombre
        
        obras(limit: 10) {
          id
          registro
          titulo
          imagen {
            id,
            title
          }
          autores {
            autores_id {
              id
              nombre
              apellido
            }
          }
        }
      }
    }
  `;
}

const { data, pending, refresh } = obtenerDatosAsinc(`obras-cajon-${props.coleccion}`, crearQuery());

watch(
  () => props.datos.id,
  (nuevoId) => {
    if (nuevoId) {
      refresh(crearQuery());
    }
  }
);

watch(data, (respuesta) => {
  const nuevo = respuesta[`${props.coleccion}_by_id`];
  datosColeccion.value = nuevo;
  console.log(datosColeccion);
});
</script>

<template>
  <div id="cajon" :class="abierto ? 'activo' : ''">
    <Cargador v-if="pending" />
    <div v-else>
      <div id="cerrar" @click="cerrarCajon">X</div>
      <h3 class="titulo">
        <NuxtLink :to="`/archivo/${coleccion}/${coleccion === 'paises' ? datosColeccion.slug : datosColeccion.id}`">{{
          datosColeccion.nombre
        }}</NuxtLink>
      </h3>
      <p>{{ datos.numObras }}</p>
      <GaleriaMosaico v-if="datosColeccion.obras" :obras="datosColeccion.obras" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
#cajon {
  position: absolute;
  top: 0;
  right: -100%;
  width: 40vw;
  background-color: rgb(241, 219, 159);
  height: 90vh;
  transition: right 0.35s ease-out;
  overflow: auto;

  &.activo {
    right: 0;
  }
}

#cerrar {
  font-size: 2em;
  cursor: pointer;
}

.titulo {
  font-size: 2em;
}

.contenedorGaleria {
  width: 38vw;

  &:deep(.obra) {
    min-width: 180px;
  }

  &:deep(.imagen) {
    max-height: 150px;
  }
}
</style>
