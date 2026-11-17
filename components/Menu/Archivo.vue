<script setup lang="ts">
import { usarGeneral } from '~/cerebros/general';
import { SUBPAGINAS, seccionDeRuta } from '~/utilidades/menu';

interface Props {
  visible: boolean;
  cerrar: () => void;
}

const props = defineProps<Props>();
const ruta = useRoute();
const contenedorMenu: Ref<HTMLElement | undefined> = ref();
const cerebroGeneral = usarGeneral();

// Menú lateral según la sección: las clasificaciones de la Colección, o las subpáginas de Recursos / Sobre ARCA.
const opciones = computed(() => {
  const seccion = seccionDeRuta(ruta.path);
  if (seccion === 'recursos' || seccion === 'sobre') return SUBPAGINAS[seccion];
  return cerebroGeneral.paginasArchivo.filter((pagina) => pagina.mostrar_en_menu);
});

const esRutaActual = (slug: string) => {
  const partes = ruta.path.split('/');

  if (!partes[1]) return false;

  if (partes[1].includes('categorias')) {
    return slug === 'categorias';
  }
  return partes[1] === slug;
};

onMounted(() => {
  document.body.addEventListener('click', clicFuera);
});

onUnmounted(() => {
  document.body.removeEventListener('click', clicFuera);
});

function clicFuera(evento: MouseEvent) {
  if (!contenedorMenu.value) return;
  const elemento = evento.target as HTMLElement;
  if (!(contenedorMenu.value === elemento || contenedorMenu.value.contains(elemento))) {
    props.cerrar();
  }
}
</script>

<template>
  <aside ref="contenedorMenu" :class="visible ? 'visible' : ''">
    <nav id="opciones" aria-label="Páginas de esta sección">
      <NuxtLink
        :to="`/${opcion.slug}`"
        v-for="opcion in opciones"
        :key="opcion.slug"
        class="opcion"
        :class="esRutaActual(opcion.slug) ? 'activo' : ''"
        :aria-current="esRutaActual(opcion.slug) ? 'page' : undefined"
        @click.native="cerrar"
      >
        <span class="punto" aria-hidden="true"></span>
        <span>{{ opcion.titulo }}</span>
      </NuxtLink>
    </nav>
  </aside>
</template>

<style lang="scss" scoped>
// Medidas del diseño: 320 px de ancho, opciones en mayúsculas de 12,5 px, píldora para la activa.
#opciones {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 36px 24px 6em 44px;
}

a,
a:link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  font-family: var(--fuenteSans);
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.06em;
  line-height: 1.35;
  text-transform: uppercase;
  color: var(--textoCuerpo);

  &:hover {
    color: var(--ocre);
  }

  .punto {
    width: 6px;
    height: 6px;
    border-radius: 999px;
    flex-shrink: 0;
    background-color: transparent;
  }

  &.activo {
    background-color: var(--arena);
    color: var(--ocre);

    .punto {
      background-color: var(--ocre);
    }
  }
}

@media (max-width: #{$minPantallaGrande - 1px}) {
  #opciones {
    padding: 4.5em 24px 6em 24px;
  }
}
</style>
