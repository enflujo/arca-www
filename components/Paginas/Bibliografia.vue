<script setup lang="ts">
import { seccionesCMS, tituloLegible } from '~/utilidades/contenidoCMS';
import { aSlug, textoPlano } from '~/utilidades/seo';

// Uso de imágenes y bibliografía · diseño «Recursos · Uso de imágenes y bibliografía-html»
// Las referencias se leen del CMS (todas sus secciones), para no perder nada de lo que se edite allí.
const props = defineProps<{ seccion: string; contenido: string }>();

const busqueda = ref('');

// Secciones con título (la intro sin título ya está en la entradilla y el aviso del diseño).
const secciones = computed(() =>
  seccionesCMS(props.contenido)
    .filter((s) => s.titulo && s.entradas.length)
    .map((s, i) => ({
      // El primer título del CMS viene en mayúsculas y con un espacio de más («F UENTES»).
      titulo: i === 0 ? 'Bibliografía general de las fuentes' : tituloLegible(textoPlano(s.titulo)),
      entradas: s.entradas.map((html) => ({ html, texto: normalizar(textoPlano(html)) })),
    }))
);

const total = computed(() => secciones.value.reduce((suma, s) => suma + s.entradas.length, 0));

function normalizar(texto: string) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

const filtradas = computed(() => {
  const termino = normalizar(busqueda.value.trim());
  return secciones.value.map((s) => ({
    ...s,
    visibles: termino ? s.entradas.filter((e) => e.texto.includes(termino)) : s.entradas,
  }));
});

const coincidencias = computed(() => filtradas.value.reduce((suma, s) => suma + s.visibles.length, 0));
</script>

<template>
  <div class="encabezadoPagina">
    <p class="ceja">{{ seccion }}</p>
    <h1 class="tituloPagina">Uso de imágenes y bibliografía</h1>
  </div>

  <p class="entradilla">
    Las imágenes de las pinturas que se encuentran en esta base de datos cumplen fundamentalmente una función académica,
    cuyo objeto es la investigación personal, referentes para el estudio de otras obras y para fines educativos.
  </p>

  <div class="panelClaro aviso">
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
    <p>
      Cada uno de los registros menciona explícitamente de dónde se tomó la imagen, bajo el rubro «Fuente». Las
      instituciones, editoriales o propietarios que allí se mencionan conservan todos los derechos de autor sobre las
      fotografías. Las solicitudes de uso de las imágenes y los permisos para su publicación deben dirigirse a aquellas
      fuentes.
    </p>
  </div>

  <div class="separadorOscuro encabezadoLista">
    <div>
      <h2 class="tituloBloque">Bibliografía general de las fuentes</h2>
      <p class="nota">
        {{ total }} referencias<template v-if="busqueda.trim()">
          · {{ coincidencias }} coinciden con la búsqueda</template
        >
      </p>
    </div>
    <div class="buscador">
      <label for="buscar-biblio" class="soloLectores">Buscar en la bibliografía</label>
      <input id="buscar-biblio" v-model="busqueda" type="search" placeholder="Buscar autor, título o año…" />
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" />
      </svg>
    </div>
  </div>

  <div class="panelClaro lista">
    <section v-for="(s, i) in filtradas" :key="s.titulo" :aria-labelledby="`seccion-${aSlug(s.titulo)}`">
      <h3 v-if="i > 0" :id="`seccion-${aSlug(s.titulo)}`" class="subtituloLista">
        {{ s.titulo }} <span class="conteo">{{ s.entradas.length }}</span>
      </h3>
      <h3 v-else :id="`seccion-${aSlug(s.titulo)}`" class="soloLectores">{{ s.titulo }}</h3>
      <p v-for="(e, j) in s.visibles" :key="j" class="referencia" v-html="e.html"></p>
      <p v-if="busqueda.trim() && !s.visibles.length" class="sinResultados">Sin coincidencias en esta sección.</p>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.aviso {
  padding: clamp(20px, 2.6vw, 28px) clamp(20px, 3vw, 32px);
  display: flex;
  gap: 20px;
  align-items: flex-start;
  margin-bottom: 28px;

  svg {
    width: 22px;
    height: 22px;
    flex-shrink: 0;
    margin-top: 2px;
    fill: none;
    stroke: var(--ocre);
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  p {
    line-height: 1.7;
  }
}

.encabezadoLista {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px 32px;
  margin-bottom: 28px;

  .nota {
    margin-top: 6px;
    font-size: 14px;
  }
}

.buscador {
  position: relative;
  display: flex;
  align-items: center;
  width: min(320px, 100%);

  input {
    width: 100%;
    height: 46px;
    box-sizing: border-box;
    padding: 0 16px 0 44px;
    border-radius: 10px;
    border: 1px solid #3a2e27;
    background-color: var(--tintaPanel);
    color: var(--sobreOscuro);
    font-family: var(--fuenteSans);
    font-size: 14px;

    &::placeholder {
      color: #9c8b75;
    }

    &:focus {
      outline: none;
      border-color: var(--oro);
    }
  }

  svg {
    position: absolute;
    left: 16px;
    width: 17px;
    height: 17px;
    fill: none;
    stroke: var(--sobreOscuroSuave);
    stroke-width: 2;
    stroke-linecap: round;
  }
}

.lista {
  padding: 12px clamp(18px, 3vw, 32px);
}

.referencia {
  margin: 0;
  padding: 16px 0;
  border-bottom: 1px solid #e0d3b8;
  font-family: var(--fuenteSerif);
  font-size: 18px !important;
  line-height: 1.6 !important;
  color: var(--tinta) !important;
  overflow-wrap: anywhere;

  :deep(a:link),
  :deep(a:visited) {
    color: var(--ocre);
  }
}

.subtituloLista {
  margin: 36px 0 4px;
  font-family: var(--fuenteSerif);
  font-weight: 400;
  font-size: 28px;
  color: var(--ocre);

  .conteo {
    font-family: var(--fuenteSans);
    font-size: 13px;
    font-weight: 600;
    color: #64492b;
    vertical-align: middle;
  }
}

.sinResultados {
  padding: 16px 0;
  font-size: 14px !important;
  color: #64492b !important;
}

.soloLectores {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
</style>
