<script setup lang="ts">
import type { ObraGaleria } from '~/tipos';
import { datosObrasGaleria } from '~/utilidades/queries';

interface ObraInformacionBasica {
  id: string;
  nombre: string;
  slug: string;
  obras: number;
}

interface Props {
  datos: ObraInformacionBasica;
  coleccion: string;
  abierto: boolean;
  cerrarCajon: () => void;
}

const props = defineProps<Props>();

const datosColeccion: Ref<ObraGaleria[] | undefined> = ref();
const query = computed(() => {
  const nombreCampo = props.coleccion === 'paises' ? 'pais' : 'ubicacion';
  return datosObrasGaleria(props.coleccion, nombreCampo, props.datos.id, false, 1, true, 10);
});

const { data, pending, refresh } = obtenerDatosAsinc(`obras-cajon-${props.coleccion}`, query.value);

watch(
  () => props.datos.id,
  (nuevoId) => {
    if (nuevoId) {
      refresh(query.value);
    }
  }
);

watch(data, (respuesta) => {
  datosColeccion.value = respuesta.obras;
});
</script>

<template>
  <div id="cajon" :class="abierto ? 'activo' : ''">
    <Cargador v-if="pending" />
    <div v-else class="contenido">
      <div id="cerrar" @click="cerrarCajon">X</div>
      <h3 class="titulo">
        <NuxtLink :to="`/${coleccion}/${coleccion === 'paises' ? datos.slug : datos.id}`">{{ datos.nombre }}</NuxtLink>
      </h3>
      <p class="contador">
        <span class="conteo">{{ datos.obras }}</span> obras en la colección
      </p>
      <GaleriaMosaico v-if="datosColeccion" :obras="datosColeccion" />
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
  height: calc(90vh - 4px);
  transition: right 0.35s ease-out;
  overflow: auto;
  border: 2px var(--profundidad) solid;
  color: var(--profundidad);
  &.activo {
    right: 0;
  }
}

.contenido {
  padding: 1.5em;
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
