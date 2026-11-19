<script setup lang="ts">
import { seccionDeRuta } from '~/utilidades/menu';

interface Props {
  visible: boolean;
  cerrar: () => void;
}

const props = defineProps<Props>();
const ruta = useRoute();
const contenedorMenu: Ref<HTMLElement | undefined> = ref();

// Grupos y páginas de la sección actual (composables/menuSeccion.ts).
const grupos = computed(() => gruposDeSeccion(seccionDeRuta(ruta.path)));
const esRutaActual = (slug: string) => esPaginaActual(ruta.path, slug);

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
      <div v-for="(grupo, i) in grupos" :key="grupo.titulo ?? i" class="grupo">
        <p v-if="grupo.titulo" class="tituloGrupo">{{ grupo.titulo }}</p>
        <NuxtLink
          :to="`/${opcion.slug}`"
          v-for="opcion in grupo.opciones"
          :key="opcion.slug"
          class="opcion"
          :class="esRutaActual(opcion.slug) ? 'activo' : ''"
          :aria-current="esRutaActual(opcion.slug) ? 'page' : undefined"
          @click.native="cerrar"
        >
          <span class="punto" aria-hidden="true"></span>
          <span>{{ opcion.titulo }}</span>
        </NuxtLink>
      </div>
    </nav>
  </aside>
</template>

<style lang="scss" scoped>
// Menú compacto: opciones en mayúsculas de 11 px agrupadas bajo tres títulos.
#opciones {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 24px 18px 5em 28px;
}

.grupo {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.tituloGrupo {
  margin: 0 0 4px;
  padding: 0 10px 5px;
  border-bottom: 1px solid var(--borde);
  font-family: var(--fuenteSerif);
  font-size: 16px;
  line-height: 1.2;
  color: var(--ocre);
}

a,
a:link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 10px;
  border-radius: 6px;
  font-family: var(--fuenteSans);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  line-height: 1.3;
  text-transform: uppercase;
  color: var(--textoCuerpo);

  &:hover {
    color: var(--ocre);
  }

  .punto {
    width: 5px;
    height: 5px;
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
    padding: 4.5em 20px 6em 20px;
  }
}
</style>
