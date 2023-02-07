<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql } from '~~/utilidades/ayudas';

const cerebroArchivo = usarArchivo();
const datos = ref(null);
const paises = ref(null);
const ubicaciones = ref(null);
const vista = ref('mapa');

cerebroArchivo.paginaActual = 'Ubicaciones';

definePageMeta({ layout: 'con-buscador', keepalive: true });

const ObrasPorPaises = gql`
  query {
    paises(filter: { obras_func: { count: { _neq: 0 } } }, limit: -1) {
      id
      nombre
      slug
      geo
      obras_func {
        count
      }
    }

    ubicaciones(limit: -1) {
      id
      nombre
      geo
      obras_func {
        count
      }
    }
  }
`;

const { data, pending } = obtenerDatosAsinc('obrasPorPais', ObrasPorPaises);

watch(data, ({ paises: datosPaises, ubicaciones: datosUbicaciones }) => {
  /**
   * Creamos Geojson agregando todas las ubicaciones y países que se van a pintar en el mapa (es más rápido que agregar muchos "source" y "layer" para cada lugar por separado)
   */
  const ubicacionesGeojson = {
    type: 'FeatureCollection',
    features: datosUbicaciones.map(({ id, nombre, obras_func, geo }) => {
      return { type: 'Feature', properties: { id, nombre, obras: obras_func.count }, geometry: geo, id };
    }),
  };
  // Geojson para países.
  const paisesGeojson = {
    type: 'FeatureCollection',
    features: datosPaises.map(({ id, nombre, slug, obras_func, geo }) => {
      return { type: 'Feature', properties: { id, nombre, slug, obras: obras_func.count }, geometry: geo, id };
    }),
  };

  /**
   * Ordenar por cantidad de obras en el país.
   */
  datos.value = datosPaises.sort((a, b) => b.obras_func.count - a.obras_func.count);

  paises.value = paisesGeojson;
  ubicaciones.value = ubicacionesGeojson;
});

function cambiarVista(llave) {
  if (llave !== vista.value) {
    vista.value = llave;
  }
}
</script>

<template>
  <h1>Ubicaciones</h1>

  <Cargador v-if="pending" />

  <div v-else id="contenedorUbicaciones">
    <div id="filtros">
      <img
        class="filtro"
        :class="vista === 'mapa' ? 'activo' : ''"
        src="~~/assets/imgs/boton_geo.svg"
        @click="cambiarVista('mapa')"
      />
      <img
        class="filtro"
        :class="vista === 'lista' ? 'activo' : ''"
        src="~~/assets/imgs/boton_alfabetico.svg"
        @click="cambiarVista('lista')"
      />
      <img
        class="filtro"
        :class="vista === 'colombinas' ? 'activo' : ''"
        src="~~/assets/imgs/boton_colombinas.svg"
        @click="cambiarVista('colombinas')"
      />
    </div>

    <Mapa
      v-if="paises && ubicaciones && vista === 'mapa'"
      :paises="paises"
      :ubicaciones="ubicaciones"
      :max="datos[0].obras_func.count"
    />

    <ul v-if="vista === 'lista'">
      <li v-for="pais in datos" :key="pais.slug">
        <NuxtLink class="nombrePais" :to="`/archivo/paises/${pais.slug}`"
          >{{ pais.nombre }} ({{ pais.obras_func.count }})</NuxtLink
        >
      </li>
    </ul>

    <ul v-if="vista === 'colombinas'">
      <li v-for="pais in datos" :key="pais.slug">
        <NuxtLink class="elementoColombina nombrePais" :to="`/archivo/paises/${pais.slug}`"
          >{{ pais.nombre }}
          <div class="colombina">
            <span class="lineaColombina" :style="`width:${pais.obras_func.count}px`"></span
            ><span class="circuloColombina"></span></div
        ></NuxtLink>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
#contenedorUbicaciones {
  overflow-x: hidden;
}

ul {
  list-style: circle;
}

#filtros {
  display: flex;
}

.filtro {
  height: 25px;
  width: auto;
  cursor: pointer;
  opacity: 0.3;
  transition: opacity 0.3s ease-in-out;
  margin: 0.3em;

  &.activo {
    opacity: 1;
  }

  &:hover {
    opacity: 0.8;
  }
}

.nombrePais {
  text-transform: uppercase;
  font-size: 0.8em;
}

// Colombinas
.elementoColombina {
  display: flex;
  width: 40vw;
  justify-content: end;
}
.colombina {
  display: flex;
  align-items: center;
  width: 500px;
  margin-left: 1em;
  .lineaColombina {
    display: block;
    height: 3px;
    background-color: black;
  }
  .circuloColombina {
    display: block;
    height: 7px;
    width: 7px;
    background-color: black;
    border-radius: 50%;
  }
}
</style>
