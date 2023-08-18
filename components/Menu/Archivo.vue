<script setup lang="ts">
import { usarGeneral } from '~/cerebros/general';

const props = defineProps({ visible: Boolean, cerrar: Function });
const ruta = useRoute();
const contenedorMenu = ref(null);
const cerebroGeneral = usarGeneral();

const paginasVisibles = computed(() => {
  return cerebroGeneral.paginasArchivo.filter((pagina) => pagina.mostrar_en_menu);
});

const esRutaActual = (slug) => {
  const partes = ruta.path.split('/');

  if (!partes[1]) return false;

  if (partes[1].includes('categorias')) {
    return slug === 'categorias';
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
        v-for="opcion in paginasVisibles"
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
  display: flex;
  flex-direction: column;
  padding: 2em 1.2em 6em 1.2em;
}

a,
a:link {
  font-size: 0.9em;
  margin-top: 0.9em;
  overflow: hidden;
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
