<script setup lang="ts">
import type { Point } from 'geojson';
import type { UbicacionProcesada } from '~/tipos';

// Recorrido de una obra: dónde se pintó (ciudad de origen) y dónde está hoy (ubicación actual),
// unidos por una línea, con la distancia entre ambos. Si solo hay un lugar, muestra ese punto.

interface Lugar {
  geo?: Point | null;
  procesado?: UbicacionProcesada[];
}

const props = defineProps<{ origen?: Lugar | null; actual?: Lugar | null }>();

const contenedorMapa: Ref<HTMLDivElement | undefined> = ref();

const nombreLugar = (lugar?: Lugar | null) => (lugar?.procesado ?? []).map((l) => l.nombre).join(', ');

// Copias simples de las coordenadas: mapbox no puede pasar los objetos reactivos de Vue a su proceso de dibujo.
const coordenadas = (geo?: Point | null): [number, number] | undefined => {
  const c = geo?.coordinates;
  return c && c.length >= 2 ? [Number(c[0]), Number(c[1])] : undefined;
};
const coordOrigen = computed(() => coordenadas(props.origen?.geo));
const coordActual = computed(() => coordenadas(props.actual?.geo));
const hayMapa = computed(() => !!(coordOrigen.value || coordActual.value));
const hayRecorrido = computed(() => !!(coordOrigen.value && coordActual.value));

/** Distancia en km entre origen y ubicación actual (fórmula del haversine). */
const distancia = computed(() => {
  if (!coordOrigen.value || !coordActual.value) return null;
  const [lon1, lat1] = coordOrigen.value;
  const [lon2, lat2] = coordActual.value;
  const rad = (g: number) => (g * Math.PI) / 180;
  const a =
    Math.sin(rad(lat2 - lat1) / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(rad(lon2 - lon1) / 2) ** 2;
  const km = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return km < 20 ? null : Math.round(km / 10) * 10;
});

const formatoKm = (km: number) => new Intl.NumberFormat('es-CO').format(km);

function marcador(clase: string, titulo: string) {
  const elemento = document.createElement('div');
  elemento.className = `marcadorObra ${clase}`;
  elemento.title = titulo;
  return elemento;
}

onMounted(async () => {
  if (!contenedorMapa.value || !hayMapa.value) return;

  // mapbox-gl solo existe en el navegador.
  const { default: mapbox } = await import('mapbox-gl');
  await import('mapbox-gl/dist/mapbox-gl.css');

  mapbox.accessToken = 'pk.eyJ1IjoiZW5mbHVqbyIsImEiOiJjbDNrOXNndXQwMnZsM2lvNDd4N2x0M3dvIn0.eWs4BHs67PcETEUI00T66Q';

  const origen = coordOrigen.value;
  const actual = coordActual.value;
  const centro = (actual ?? origen) as [number, number];

  // Con dos lugares, el mapa nace encuadrando ambos (no depende de que termine de cargar).
  const encuadre =
    origen && actual
      ? {
          bounds: new mapbox.LngLatBounds(origen, origen).extend(actual),
          fitBoundsOptions: { padding: 50, maxZoom: 6 },
        }
      : { center: centro, zoom: 3 };

  const mapa = new mapbox.Map({
    container: contenedorMapa.value,
    style: 'mapbox://styles/enflujo/clbmr4ink000314lg4hi2hcm1/draft',
    attributionControl: false,
    cooperativeGestures: true,
    ...encuadre,
  });

  mapa.addControl(new mapbox.NavigationControl({ showCompass: false }), 'top-right');
  // Botón para ver el mapa en pantalla completa.
  mapa.addControl(new mapbox.FullscreenControl(), 'top-right');

  // Los marcadores no necesitan esperar al estilo.
  if (origen) {
    new mapbox.Marker({ element: marcador('origen', `Pintada en ${nombreLugar(props.origen)}`) })
      .setLngLat(origen)
      .addTo(mapa);
  }
  if (actual) {
    new mapbox.Marker({ element: marcador('actual', `Hoy en ${nombreLugar(props.actual)}`) })
      .setLngLat(actual)
      .addTo(mapa);
  }

  // La línea del recorrido se agrega en cuanto el estilo está listo.
  if (origen && actual) {
    const dibujarRecorrido = () => {
      if (mapa.getSource('recorrido')) return;
      mapa.addSource('recorrido', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: { type: 'LineString', coordinates: [origen, actual] },
        },
      });
      mapa.addLayer({
        id: 'recorrido',
        type: 'line',
        source: 'recorrido',
        layout: { 'line-cap': 'round' },
        paint: { 'line-color': '#8a5f14', 'line-width': 2, 'line-dasharray': [1.5, 2] },
      });
    };

    if (mapa.isStyleLoaded()) dibujarRecorrido();
    else mapa.on('style.load', dibujarRecorrido);
  }
});
</script>

<template>
  <figure v-if="nombreLugar(origen) || nombreLugar(actual)" class="mapaObra">
    <div
      v-if="hayMapa"
      ref="contenedorMapa"
      class="lienzo"
      role="img"
      :aria-label="
        hayRecorrido
          ? `Mapa del recorrido de la obra desde ${nombreLugar(origen)} hasta ${nombreLugar(actual)}`
          : `Mapa de ${nombreLugar(actual) || nombreLugar(origen)}`
      "
    ></div>

    <figcaption class="leyenda">
      <p class="tituloLeyenda">{{ hayRecorrido ? 'Recorrido de la obra' : 'Dónde está la obra' }}</p>
      <ul>
        <li v-if="nombreLugar(origen)">
          <span class="punto origen" aria-hidden="true"></span>
          <span class="rotulo">Pintada en</span>
          <span class="lugares">
            <template v-for="(lugar, i) in origen?.procesado" :key="`origen-${lugar.url}`">
              <template v-if="i > 0">, </template>
              <NuxtLink :to="lugar.url">{{ lugar.nombre }}</NuxtLink>
            </template>
          </span>
        </li>
        <li v-if="nombreLugar(actual)">
          <span class="punto actual" aria-hidden="true"></span>
          <span class="rotulo">Hoy en</span>
          <span class="lugares">
            <template v-for="(lugar, i) in actual?.procesado" :key="`actual-${lugar.url}`">
              <template v-if="i > 0">, </template>
              <NuxtLink :to="lugar.url">{{ lugar.nombre }}</NuxtLink>
            </template>
          </span>
        </li>
      </ul>
      <p v-if="distancia" class="distancia">
        Recorrió cerca de <strong>{{ formatoKm(distancia) }} km</strong> desde donde fue pintada.
      </p>
    </figcaption>
  </figure>
</template>

<style lang="scss" scoped>
.mapaObra {
  margin: 0;
  border: 1px solid var(--borde);
  border-radius: 14px;
  overflow: hidden;
  background-color: var(--papel);
}

.lienzo {
  height: 340px;
  width: 100%;
  background-color: #eadfd0;
}

.leyenda {
  padding: 16px 18px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tituloLeyenda {
  margin: 0;
  font-family: var(--fuenteSans);
  font-size: 0.72em;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--textoSuave);
}

ul {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

li {
  display: grid;
  grid-template-columns: 14px auto 1fr;
  align-items: baseline;
  gap: 4px 10px;
  font-size: 0.95em;
  line-height: 1.4;
}

.rotulo {
  font-weight: 600;
  color: var(--textoSuave);
  white-space: nowrap;
}

.lugares a:link,
.lugares a:visited {
  color: var(--tinta);
  border-bottom: 1px solid var(--bordeFuerte);
}

.lugares a:hover {
  color: var(--ocre);
}

.punto {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  box-sizing: border-box;
  transform: translateY(1px);

  &.origen {
    border: 2.5px solid var(--ocre);
    background-color: var(--papel);
  }

  &.actual {
    background-color: var(--ocre);
    box-shadow: 0 0 0 3px rgba(138, 95, 20, 0.25);
  }
}

.distancia {
  margin: 4px 0 0;
  padding-top: 10px;
  border-top: 1px solid var(--borde);
  font-size: 0.9em;
  color: var(--textoCuerpo);

  strong {
    font-family: var(--fuenteSerif);
    font-size: 1.15em;
    font-weight: 400;
    color: var(--ocre);
  }
}

// Marcadores dentro del mapa (los crea mapbox fuera del ámbito del componente).
:deep(.marcadorObra) {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  box-sizing: border-box;
  cursor: default;

  &.origen {
    border: 3px solid #8a5f14;
    background-color: #faf6ec;
  }

  &.actual {
    background-color: #8a5f14;
    border: 2px solid #faf6ec;
    box-shadow: 0 0 0 4px rgba(138, 95, 20, 0.3);
  }
}
</style>
