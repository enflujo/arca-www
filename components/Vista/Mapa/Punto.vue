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
  mapa.scrollZoom.disable();

  mapa.on('load', () => {
    /**
     * 🏛 Nombre del lugar
     */
    const etiqueta = new mapbox.Popup({
      className: 'etiqueta',
      closeButton: false,
      closeOnClick: false,
    })
      .setLngLat(coordenadas)
      .setText(props.punto.nombre)
      .setMaxWidth('300px');

    /**
     * Agregar marcador del lugar
     * */
    new mapbox.Marker({
      color: '#9e171f',
      draggable: false,
    })
      .setLngLat(coordenadas)
      .setPopup(etiqueta)
      .addTo(mapa)
      .togglePopup();
  });
});
</script>

<template>
  <div id="mapaPunto" ref="contenedorMapa"></div>
</template>

<style lang="scss">
#mapaPunto {
  margin: 1em;
  display: block;
  height: 50vh;
  width: 20vw;

  .etiqueta {
    color: var(--profundidad);
  }

  .icono {
    background-image: url('~~/assets/imgs/icono-imagen.svg');
    background-size: cover;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
  }

  .mapboxgl-popup-content {
    background: $dolor;
    color: $mediana;
  }

  .mapboxgl-popup-tip {
    border-top-color: $dolor;
  }
}
</style>
