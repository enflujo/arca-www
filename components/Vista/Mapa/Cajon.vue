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
});
</script>

<template>
  <div id="cajon" :class="abierto ? 'activo' : ''">
    <Cargador v-if="pending" />
    <div v-else>
      <div id="cerrar" @click="cerrarCajon">X</div>
      <h3 class="titulo">
        <NuxtLink :to="`/${coleccion}/${coleccion === 'paises' ? datosColeccion.slug : datosColeccion.id}`">{{
          datosColeccion.nombre
        }}</NuxtLink>
      </h3>
      <p class="contador">
        <span class="conteo">{{ datos.numObras }}</span> obras en la colección
      </p>
      <GaleriaMosaico v-if="datosColeccion.obras" :obras="datosColeccion.obras" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
#cajon {
  position: absolute;
  top: 0;
  right: -100%;
  width: 60vw;
  background-color: var(--amarilloPetalo);
  height: 90vh;
  transition: right 0.35s ease-out;
  overflow: auto;
  padding: 1.5em;
  border: 2px var(--profundidad) solid;
  color: var(--profundidad);
  &.activo {
    right: 0;
  }
}

#cerrar {
  font-size: 2em;
  cursor: pointer;
  position: absolute;
  right: 13px;
  background-color: var(--claridad);
  color: rgba(175, 40, 40, 0.7);
  border: var(--claridad) solid 1px;
  border-radius: 50%;
  font-size: 1em;
  padding: 0.1em 0.3em;
  font-weight: bold;

  &:hover {
    color: var(--claridad);
    background-color: var(--dolor);
  }
}

.titulo {
  font-size: 2em;
  margin-bottom: 0.2em;
}

.contador {
  padding: 0.7em;
  border: 2px solid #08173e;
  display: inline-block;
  margin: 0.3em 0 1em 0;
}

.conteo {
  font-weight: bold;
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

// Pantallas grandes
@media (min-width: $minPantallaGrande) {
  #cajon {
    width: 40vw;
  }
}
</style>
