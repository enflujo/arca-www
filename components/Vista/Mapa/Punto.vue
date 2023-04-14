<script setup>
import mapbox from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import iconoImagen from '~~/assets/imgs/icono-imagen.svg';

const contenedorMapa = ref(null);
const props = defineProps({
  ubicaciones: Object,
});

const punto = props.ubicaciones.features.properties;

onMounted(() => {
  const estilo = 'mapbox://styles/enflujo/clbmr4ink000314lg4hi2hcm1/draft';
  mapbox.accessToken = 'pk.eyJ1IjoiZW5mbHVqbyIsImEiOiJjbDNrOXNndXQwMnZsM2lvNDd4N2x0M3dvIn0.eWs4BHs67PcETEUI00T66Q';

  const mapa = new mapbox.Map({
    container: contenedorMapa.value,
    style: estilo,
    zoom: 2,
    center: punto.geometry.coordinates,
  });
  console.log(props.ubicaciones.features);
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
      draggable: true,
    })
      .setLngLat(punto.geometry.coordinates)
      .addTo(mapa);

    const alturaMarcador = 50;
    const radioMarcador = 10;
    const desplazamientoLinear = 25;
    const popupOffsets = {
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
    const etiqueta = new mapbox.Popup({ offset: popupOffsets, className: 'etiqueta', closeOnClick: false })
      .setLngLat(punto.geometry.coordinates)
      .setHTML(punto.nombre)
      .setMaxWidth('300px')
      .addTo(mapa);

    // /**
    //  * Cargar icono de imágenes al mapa
    //  */
    // const icono = new Image(15, 15);
    // // Agregar icono a la instancia del mapa (se necesita para usarlo más adelante en las capas).
    // icono.onload = () => mapa.addImage('icono', icono);
    // icono.src = iconoImagen;

    // mapa.addLayer({
    //   id: 'nombre',
    //   type: 'symbol',
    //   source: 'ubicaciones',
    //   filter: ['!', ['has', 'point_count']],
    //   layout: {
    //     'text-field': [
    //       'format',
    //       ['get', 'nombre'],
    //       { 'font-scale': 0.8 },
    //       '\n',
    //       ['image', 'icono'],punto
    //       ' ',
    //       ['get', 'obras'],
    //       { 'font-scale': 0.75 },
    //     ],
    //   },
    //   paint: {
    //     'text-color': '#202',
    //     'text-halo-color': '#fff',
    //     'text-halo-width': ['case', ['boolean', ['feature-state', 'activo'], false], 3, 0],
    //     'text-halo-blur': 2,
    //   },
    // });

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
  margin: 1em;
  display: block;
  min-height: 50vh;
  width: 20vw;
  .etiqueta {
    color: var(--dolor);
  }
}
</style>

<style lang="scss" scoped>
#contenedor {
  position: relative;
}
</style>
