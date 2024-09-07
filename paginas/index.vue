<script setup lang="ts">
import { usarGeneral } from '~/cerebros/general';
import type { Imagen } from '~/tipos';
import { gql, urlImagen } from '~/utilidades/ayudas';
import fondoPredeterminado from '~/assets/imgs/Portada_ARCA.jpg';

type Seccion = { titulo: string; texto: string };
type Pagina = { titulo: string; slug: string; secciones: Seccion[] };
const general = usarGeneral();

// El título en este caso es nulo ya que el título que pasamos a esta función se vuelve el subtítulo,
// al ser la página inicial no se necesita.
useHead(elementosCabeza({}, '/'));

interface Esquema {
  general: { portada?: Imagen };
  paginas: Pagina[];
}

const Portada = gql`
  query {
    general {
      portada {
        id
        title
      }
    }
    paginas(filter: { slug: { _eq: "sobre-arca" } }, limit: 1) {
      titulo
      slug
      descripcion
      banner {
        id
        title
      }
      secciones
    }
  }
`;

const { data, status } = obtenerDatosAsinc<Esquema>('portada', Portada);
const imgPortada: Ref = ref(null);
const pagina: Ref = ref(null);
const secciones: Ref = ref([]);

watch(data, (respuesta) => {
  if (!respuesta) return;
  const { general, paginas } = respuesta;
  pagina.value = paginas[0];
  secciones.value = paginas[0].secciones.filter((seccion: Seccion) => !!seccion.texto);
  imgPortada.value = general.portada ? urlImagen(general.portada.id, 'portada') : fondoPredeterminado;
});
</script>

<template>
  <Cargador v-if="status === 'pending' && !pagina" />

  <div id="portada" :style="`background-image:url(${imgPortada})`">
    <Logo class="svgClaro" />
    <h1 class="titulo logo-texto">{{ general.titulo }}</h1>
    <div
      v-if="pagina && pagina.secciones"
      v-for="(seccion, i) in pagina.secciones"
      :key="`seccion-intro${i}`"
      class="seccion"
    >
      <section v-if="seccion.titulo || seccion.texto">
        <h2 class="tituloSeccion">{{ seccion.titulo }}</h2>
        <div class="contenidoSeccion" v-html="seccion.texto"></div>
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:color';

#portada {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 90vh;
  width: 100%;
  z-index: 1;
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-size: cover;
}

.logoArca {
  width: 125px;
  margin-top: 10px;
  display: block;
  position: relative;
  color: var(--claridad);
}

.titulo {
  font-size: 3em;
  margin: 0;
  z-index: 10;
}

.logo-texto {
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--claridad);
}

.svgClaro {
  fill: var(--claridad);
}

.seccion {
  color: var(--claridad);
  width: 50%;
  margin: 1em;
  text-align: center;
}

.contenidoSeccion {
  display: block;
  margin-top: 0.5em;
  margin-bottom: 1.5em;
}
</style>
