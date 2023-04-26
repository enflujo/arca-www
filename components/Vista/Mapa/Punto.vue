<script setup>
import mapbox from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const contenedorMapa = ref(null);

const props = defineProps({
  punto: Object,
});

onMounted(() => {
  const estilo = 'mapbox://styles/enflujo/clbmr4ink000314lg4hi2hcm1/draft';
  mapbox.accessToken = 'pk.eyJ1IjoiZW5mbHVqbyIsImEiOiJjbDNrOXNndXQwMnZsM2lvNDd4N2x0M3dvIn0.eWs4BHs67PcETEUI00T66Q';

  const coordenadas = props.punto.geometry.coordinates;

  const mapa = new mapbox.Map({
    container: contenedorMapa.value,
    style: estilo,
    zoom: 2,
    center: coordenadas,
    attributionControl: false,
  });

  mapa.on('load', () => {
    /**
     * Agregar marcador del lugar
     * */
    new mapbox.Marker({
      color: '#9e171f',
      draggable: false,
    })
      .setLngLat(coordenadas)
      .addTo(mapa);
  });
});
</script>

<template>
  <div id="mapaPunto" ref="contenedorMapa"></div>
</template>

<style lang="scss">
#mapaPunto {
  display: block;
  height: 200px;
  width: 100%;
}
</style>
