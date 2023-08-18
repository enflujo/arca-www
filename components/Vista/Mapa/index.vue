<script setup lang="ts">
import mapbox from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import iconoImagen from '~~/assets/imgs/icono-imagen.svg';

const contenedorMapa = ref(null);
const props = defineProps({
  paises: Object,
  ubicaciones: Object,
  max: Number,
});
const coleccionActual = ref(null);
const datosCajon = reactive({ id: null, obras: 0 });
const cajonAbierto = ref(false);

onMounted(() => {
  const estilo = 'mapbox://styles/enflujo/clbmr4ink000314lg4hi2hcm1/draft';
  mapbox.accessToken = 'pk.eyJ1IjoiZW5mbHVqbyIsImEiOiJjbDNrOXNndXQwMnZsM2lvNDd4N2x0M3dvIn0.eWs4BHs67PcETEUI00T66Q';

  const mapa = new mapbox.Map({
    container: contenedorMapa.value,
    style: estilo,
    zoom: 2,
    attributionControl: false,
  });

  /**
   * Cargar icono de imágenes al mapa
   */
  const icono = new Image(15, 15);
  // Agregar icono a la instancia del mapa (se necesita para usarlo más adelante en las capas).
  icono.onload = () => mapa.addImage('icono', icono);
  icono.src = iconoImagen;

  /**
   * Esperar a que el mapa de mapbox termine de cargar antes de llenarlo con los datos.
   */
  mapa.on('load', () => {
    // Crea la fuente con todos los paises (polígonos).
    mapa.addSource('paises', {
      type: 'geojson',
      data: props.paises,
    });

    // Crea la fuente para todas las ubicaciones (puntos).
    mapa.addSource('ubicaciones', {
      type: 'geojson',
      data: props.ubicaciones,
      cluster: true,
      clusterRadius: 100,
      clusterProperties: {
        // Esto suma la cantidad de obras que tiene un grupo,
        // para poder actualizar los círculos a medida que se hace zoom
        obras: ['+', ['get', 'obras']],
      },
    });

    /**
     * 🇨🇴 Pintar las zonas de cada país dependiendo del numero de obras.
     */
    mapa.addLayer({
      id: 'zonas',
      type: 'fill',
      source: 'paises', // extrae los datos de la fuente "paises" que creamos antes.
      layout: {},
      paint: {
        /**
         * ['interpolate', [linear]] | Crea una escala lineal entre dos colores.
         * ['get', 'obras'] | Saca el numero de obras que tiene un país desde el geojson `properties.obras`
         * Los 4 valores que siguen corresponden a la escala: valorMin, colorMin, valorMax, colorMax.
         */
        'fill-color': ['interpolate', ['linear'], ['get', 'obras'], 0, '#49C5B6', props.max, '#107177'],
        'fill-opacity': ['case', ['boolean', ['feature-state', 'activo'], false], 0.8, 0.7],
      },
    });

    /**
     * 🔵 Los círculos que agrupan varios lugares dependiendo del zoom.
     */
    mapa.addLayer({
      id: 'grupos',
      type: 'circle',
      source: 'ubicaciones',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': ['interpolate', ['linear'], ['get', 'obras'], 0, '#FFE485', props.max, '#D14836'],
        /**
         * ['step'] | A diferencia de "interpolate", "step" crea una serie de puntos donde algo debe cambiar.
         * ['get', 'obras'] | La cantidad de obras dentro del círculo, sale de "clusterProperties" que definimos al crear la capa.
         * En "step" se pueden crear los cortes que uno quiera, los valores que siguen deben ser impares:
         * anchoMin, corte1, ancho1, corte2, ancho2, ....
         */
        'circle-radius': ['step', ['get', 'obras'], 15, 100, 30, 750, 40],
        'circle-opacity': ['case', ['boolean', ['feature-state', 'activo'], false], 1, 0.8],
      },
    });

    /**
     * 🅰 Texto dentro del círculo
     */
    mapa.addLayer({
      id: 'contadorObras',
      type: 'symbol',
      source: 'ubicaciones',
      // Sólo mostrarlo cuando tiene más de un lugar agrupado ("point_count" lo crea mapbox y se va actualizando con el zoom).
      filter: ['has', 'point_count'],
      layout: {
        /**
         * 'format' | Permite concatenar una serie de textos o imágenes.
         * ['image', 'icono'] | Pone la imagen que registramos antes en la instancia de mapbox.
         */
        'text-field': ['format', ['image', 'icono'], ' ', ['get', 'obras']],
        // 'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12,
      },
    });

    /**
     * ⭕ Punto cuando es 1 lugar y no un "cluster".
     */
    mapa.addLayer({
      id: 'punto',
      type: 'circle',
      source: 'ubicaciones',
      filter: ['!', ['has', 'point_count']], // Cuando NO tiene "point_count" ya no es un grupo y es sólo 1 punto.
      paint: {
        'circle-color': 'white',
        'circle-radius': 5,
        'circle-opacity': 0.7,
      },
    });

    /**
     * 🏛 Nombre del lugar
     */
    mapa.addLayer({
      id: 'nombre',
      type: 'symbol',
      source: 'ubicaciones',
      filter: ['!', ['has', 'point_count']],
      layout: {
        'text-field': [
          'format',
          ['get', 'nombre'],
          { 'font-scale': 0.8 },
          '\n',
          ['image', 'icono'],
          ' ',
          ['get', 'obras'],
          { 'font-scale': 0.75 },
        ],
      },
      paint: {
        'text-color': '#fff',
        'text-halo-color': '#716b6b',
        'text-halo-width': ['case', ['boolean', ['feature-state', 'activo'], false], 3, 2],
        'text-halo-blur': 0,
      },
    });

    // Lienzo donde están pintados los datos.
    const lienzo = mapa.getCanvas();
    let idElementoEncima = null;
    let fuenteElementoEncima = null;

    /**
     * 🐁 Eventos del ratón.
     */
    mapa.on('mousemove', (e) => {
      // Buscar elementos de las capas (Círculos, países o nombres de lugares)
      const elementos = mapa.queryRenderedFeatures(e.point, {
        layers: ['grupos', 'zonas', 'nombre'],
      });

      // Si es alguno de los elementos sensibles al ratón.
      if (elementos.length) {
        // Cambiar cursor
        lienzo.style.cursor = 'pointer';

        // Referencia al elemento
        const { properties, source } = elementos[0];
        // Identificador del elemento dentro de mapbox.
        const id = properties.cluster_id ? properties.cluster_id : properties.id;

        if (id && (id !== idElementoEncima || source !== fuenteElementoEncima)) {
          // desactivar los estados anteriores si existe alguno
          if (fuenteElementoEncima && idElementoEncima) {
            mapa.setFeatureState({ source: fuenteElementoEncima, id: idElementoEncima }, { activo: false });
          }

          // Poner "activo" el elemento para que actualice el estado en mapbox.
          mapa.setFeatureState({ source: source, id }, { activo: true });
          idElementoEncima = id;
          fuenteElementoEncima = source;
        }
      } else {
        // Cambiar cursor
        lienzo.style.cursor = '';

        // Desactivar si ya salió el ratón y cambiar el elemento a su estado original.
        if (fuenteElementoEncima && idElementoEncima) {
          mapa.setFeatureState({ source: fuenteElementoEncima, id: idElementoEncima }, { activo: false });
          idElementoEncima = null;
          fuenteElementoEncima = null;
        }
      }
    });

    /**
     * 🔍 Hacer zoom cuando se hace clic en un círculo / grupo de ubicaciones.
     */
    mapa.on('click', 'grupos', (e) => {
      const circulos = mapa.queryRenderedFeatures(e.point, {
        layers: ['grupos'],
      });
      const idGrupo = circulos[0].properties.cluster_id;

      mapa.getSource('ubicaciones').getClusterExpansionZoom(idGrupo, (err, zoom) => {
        if (err) return;

        mapa.easeTo({
          center: circulos[0].geometry.coordinates,
          zoom,
        });
      });

      // El click sucedió primero acá y revisamos luego para saltar los que siguen (stopEventPropagation no funciona acá porque es un "canvas" y no elemento del DOM).
      e.clicEnElemento = true;
      cajonAbierto.value = false;
    });

    // Clic en nombre del lugar (cuando no están agrupados)
    mapa.on('click', 'nombre', (e) => {
      // Saltar el evento si el click es en otro elemento anterior.
      if (e.clicEnElemento) {
        return;
      }

      abrirCajon('ubicaciones', e.features[0].properties);
      e.clicEnElemento = true;
    });

    mapa.on('click', 'zonas', (e) => {
      if (e.clicEnElemento) {
        return;
      }

      abrirCajon('paises', e.features[0].properties);
      e.clicEnElemento = true;
    });

    mapa.on('click', (e) => {
      const elementos = mapa.queryRenderedFeatures(e.point, {
        layers: ['grupos', 'zonas', 'nombre'],
      });

      if (!elementos.length) {
        cajonAbierto.value = false;
      }
    });
  }); // Fin de mapa.on('load')
});

function abrirCajon(coleccion, datos) {
  Object.assign(datosCajon, datos);

  if (coleccionActual.value !== coleccion) {
    coleccionActual.value = coleccion;
  }

  cajonAbierto.value = true;
}

function cerrarCajon() {
  cajonAbierto.value = false;
}
</script>

<template>
  <div id="contenedor">
    <div id="mapa" ref="contenedorMapa"></div>
    <VistaMapaCajon
      v-if="coleccionActual"
      :coleccion="coleccionActual"
      :datos="datosCajon"
      :abierto="cajonAbierto"
      :cerrarCajon="cerrarCajon"
    />
  </div>
</template>

<style lang="scss">
#mapa {
  display: block;
  min-height: 90vh;
}
</style>

<style lang="scss" scoped>
#contenedor {
  position: relative;
  overflow: hidden;
}
</style>
