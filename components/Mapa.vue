<template>
  <div id="mapa" ref="mapa"></div>
</template>

<script>
import mapboxgl from 'mapbox-gl';

export default {
  props: {
    datos: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      mapboxToken: 'pk.eyJ1IjoiamVhbm5pZmZlciIsImEiOiJja2VkdDZwYjAwNXF6MnNwYnRlMHQ4ajVnIn0.kDpYun6BmgQSq64VpHSmSQ',
      mapboxStyle: 'mapbox://styles/jeanniffer/ckq1ei32a3x4v17mi3i14j1eb',
      mapa: null,
    };
  },

  mounted() {
    mapboxgl.accessToken = this.mapboxToken;
    this.mapa = new mapboxgl.Map({
      container: this.$refs.mapa,
      style: this.mapboxStyle,
      // center: [-77.04, 38.907],
      // zoom: 2,
    });

    this.mapa.on('load', this.mapaCargado);
  },

  methods: {
    mapaCargado() {
      const geoJson = {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      };

      geoJson.data.features = this.$props.datos.map((punto) => {
        const { latitude_current: lat, longitude_current: lon, title, annotation_date: date } = punto;

        return {
          type: 'Feature',
          properties: {
            description: `${title} (${date})`,
          },
          geometry: {
            type: 'Point',
            coordinates: [lon, lat],
          },
        };
      });

      this.mapa.addSource('lugares', geoJson);

      this.mapa.addLayer({
        id: 'lugares',
        type: 'circle',
        source: 'lugares',
        paint: {
          'circle-color': '#4264fb',
          'circle-radius': 6,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
      });

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });

      this.mapa.on('mouseenter', 'lugares', (e) => {
        // Change the cursor style as a UI indicator.
        this.mapa.getCanvas().style.cursor = 'pointer';

        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = e.features[0].properties.description;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(coordinates).setHTML(description).addTo(this.mapa);
      });

      this.mapa.on('mouseleave', 'lugares', () => {
        this.mapa.getCanvas().style.cursor = '';
        popup.remove();
      });
    },

    sumar(a, b) {
      return a + b;
    },
  },
};
</script>

<style lang="scss" scoped>
#mapa {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  display: block;
  z-index: -1;
}

.mapboxgl-popup {
  position: absolute;
  max-width: 400px;
  font: 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
}
</style>
