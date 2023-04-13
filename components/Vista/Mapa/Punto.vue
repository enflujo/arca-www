<script setup>
import mapbox from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import iconoImagen from '~~/assets/imgs/icono-imagen.svg';

const contenedorMapa = ref(null);
const props = defineProps({
  ubicaciones: Object,
});

onMounted(() => {
  const estilo = 'mapbox://styles/enflujo/clbmr4ink000314lg4hi2hcm1/draft';
  mapbox.accessToken = 'pk.eyJ1IjoiZW5mbHVqbyIsImEiOiJjbDNrOXNndXQwMnZsM2lvNDd4N2x0M3dvIn0.eWs4BHs67PcETEUI00T66Q';

  const mapa = new mapbox.Map({
    container: contenedorMapa.value,
    style: estilo,
    zoom: 2,
  });
  console.log(props.ubicaciones);
  mapa.on('load', () => {
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
     * Cargar icono de imágenes al mapa
     */
    const icono = new Image(15, 15);
    // Agregar icono a la instancia del mapa (se necesita para usarlo más adelante en las capas).
    icono.onload = () => mapa.addImage('icono', icono);
    icono.src = iconoImagen;
    console.log(props, mapa);
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
        'text-color': '#202',
        'text-halo-color': '#fff',
        'text-halo-width': ['case', ['boolean', ['feature-state', 'activo'], false], 3, 0],
        'text-halo-blur': 2,
      },
    });

    // Lienzo donde están pintados los datos.
    const lienzo = mapa.getCanvas();
    let idElementoEncima = null;
    let fuenteElementoEncima = null;
  });
});
</script>

<template>
  <div id="contenedor">
    <div id="mapa" ref="contenedorMapa"></div>
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
}
</style>
