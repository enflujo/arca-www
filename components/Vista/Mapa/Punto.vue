<script setup>
import mapbox from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const contenedorMapa = ref(null);

const props = defineProps({
  ubicaciones: Object,
});

const punto = props.ubicaciones.features.properties;

// Ícono personalizado en no Vue. En Vue cómo???!!!
/* const el = document.createElement('div');
el.className = 'icono'; */

onMounted(() => {
  const estilo = 'mapbox://styles/enflujo/clbmr4ink000314lg4hi2hcm1/draft';
  mapbox.accessToken = 'pk.eyJ1IjoiZW5mbHVqbyIsImEiOiJjbDNrOXNndXQwMnZsM2lvNDd4N2x0M3dvIn0.eWs4BHs67PcETEUI00T66Q';

  const mapa = new mapbox.Map({
    container: contenedorMapa.value,
    style: estilo,
    zoom: 2,
    center: punto.geometry.coordinates,
  });

  mapa.on('load', () => {
    mapa.addSource('ubicaciones', {
      type: 'geojson',
      data: props.ubicaciones,
      cluster: false,
    });

    /**
     * Agregar marcador del lugar
     * */
    const marcador = new mapbox.Marker({
      color: '#9e171f',
      draggable: false,
    })
      .setLngLat(punto.geometry.coordinates)
      .addTo(mapa);

    const alturaMarcador = 30;
    const radioMarcador = 20;
    const desplazamientoLinear = 35;
    const desplazamientosEtiqueta = {
      top: [0, 0],
      'top-left': [0, 0],
      'top-right': [0, 0],
      bottom: [0, -alturaMarcador],
      'bottom-left': [desplazamientoLinear, (alturaMarcador - radioMarcador + desplazamientoLinear) * -1],
      'bottom-right': [-desplazamientoLinear, (alturaMarcador - radioMarcador + desplazamientoLinear) * -1],
      left: [radioMarcador, (alturaMarcador - radioMarcador) * -1],
      right: [-radioMarcador, (alturaMarcador - radioMarcador) * -1],
    };

    /**
     * 🏛 Nombre del lugar
     */
    const etiqueta = new mapbox.Popup({ offset: desplazamientosEtiqueta, className: 'etiqueta', closeOnClick: false })
      .setLngLat(punto.geometry.coordinates)
      .setHTML(punto.nombre)
      .setMaxWidth('300px')
      .addTo(mapa);

    // Lienzo donde están pintados los datos.
    const lienzo = mapa.getCanvas();
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
  margin: 1em;
  display: block;
  min-height: 50vh;
  width: 20vw;
  .etiqueta {
    color: var(--dolor);
  }
  .icono {
    background-image: url('~~/assets/imgs/icono-imagen.svg');
    background-size: cover;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
  }
}
</style>

<style lang="scss" scoped>
#contenedor {
  position: relative;
}
</style>
