<script setup>
import { usarGeneral } from '~/cerebros/general';

const props = defineProps({ visible: Boolean, cerrar: Function });
const ruta = useRoute();
const contenedorMenu = ref(null);
const cerebroGeneral = usarGeneral();
/**
 * obras
 * autores
 * personajes
 * fuentes
 * ubicaciones
 * ciudades
 * paises
 * categorias1
 * categorias2
 * categorias3
 * categorias4
 * categorias5
 * categorias6
 * objetos
 * escenarios
 * tecnicas
 * donantes
 * relatos_visuales
 * complejos_gestuales
 * tipos_gestuales
 * gestos
 * fisiognomica
 * fisiognomica_imagen
 * cartelas_filacterias
 * rostros
 * simbolos
 * descriptores
 * caracteristicas
 */
const opciones = [
  { nombre: 'Autores', slug: 'autores' },
  { nombre: 'Categorías', slug: 'categorias' },
  { nombre: 'Escenarios', slug: 'escenarios' },
  { nombre: 'Técnicas', slug: 'tecnicas' },
  { nombre: 'Donantes', slug: 'donantes' },
  { nombre: 'Ubicaciones', slug: 'ubicaciones' },
  { nombre: 'Relatos Visuales', slug: 'relatos-visuales' },
  { nombre: 'Descriptores', slug: 'descriptores' },
  { nombre: 'Objetos', slug: 'objetos' },
  { nombre: 'Gestos', slug: 'gestos' },
  { nombre: 'Tipo Gestual', slug: 'tipo-gestual' },
  { nombre: 'Complejo Gestual', slug: 'complejo-gestual' },
  { nombre: 'Cartela - Filacteria', slug: 'cartela-filacteria' },
  { nombre: 'Símbolos', slug: 'simbolos' },
  { nombre: 'Características Particulares', slug: 'caracteristicas-particulares' },
  { nombre: 'Fisiognómica', slug: 'fisiognomica' },
  { nombre: 'Fisiognómica Imagen', slug: 'fisiognomica-imagen' },
  { nombre: 'Personajes', slug: 'personajes' },
  { nombre: 'Rostros', slug: 'rostros' },
];

const esRutaActual = (slug) => {
  const partes = ruta.path.split('/');

  if (!partes[1]) return false;

  if (partes[1].includes('categorias')) {
    return slug === 'categorias';
  } else if (partes[1] === 'paises') {
    return slug === 'ubicaciones';
  }
  return partes.includes(slug);
};

onMounted(() => {
  document.body.addEventListener('click', clicFuera);
});

onUnmounted(() => {
  document.body.removeEventListener('click', clicFuera);
});

function clicFuera(evento) {
  if (!(contenedorMenu.value === evento.target || contenedorMenu.value.contains(evento.target))) {
    props.cerrar();
  }
}
</script>

<template>
  <aside ref="contenedorMenu" :class="visible ? 'visible' : ''">
    <nav id="opciones">
      <NuxtLink
        :to="`/${opcion.slug}`"
        v-for="opcion in cerebroGeneral.paginasArchivo"
        :key="opcion.slug"
        class="opcion"
        :class="esRutaActual(opcion.slug) ? 'activo' : ''"
        @click.native="cerrar"
      >
        {{ opcion.titulo }}
      </NuxtLink>
    </nav>
  </aside>
</template>

<style lang="scss" scoped>
@use 'sass:color';

#opciones {
  text-transform: uppercase;
  margin: 0 0 3em 1.8em;
  display: flex;
  flex-direction: column;
  padding: 2em 0 3em 0;
}

a,
a:link {
  font-size: 0.9em;
  margin-top: 0.9em;
  overflow: hidden;
  padding-left: 1.4em;
  color: var(--mediana);
  font-family: var(--fuenteMenu);
  font-weight: bold;

  &:hover {
    color: darken($mediana, 10%);
  }

  &.activo {
    color: darken($mediana, 20%);
  }
}
</style>
