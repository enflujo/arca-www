<script setup lang="ts">
import { usarArchivo } from '~/cerebros/archivo';
import type { Vistas } from '~/tipos';

interface Props {
  vistaInicial: Vistas;
  vistas: Vistas[];
}

const props = withDefaults(defineProps<Props>(), {
  vistaInicial: 'abc',
});

const ruta = useRoute();
const enrutador = useRouter();
const cerebroArchivo = usarArchivo();
const posiblesVistas: Vistas[] = ['mapa', 'abc', 'colombinas'];
const nombresVistas: Record<Vistas, string> = { abc: 'A – Z', colombinas: 'Por cantidad', mapa: 'Mapa' };

onMounted(() => {
  if (ruta.query.vista && posiblesVistas.includes(ruta.query.vista as Vistas)) {
    cerebroArchivo.vistaActual = ruta.query.vista as Vistas;
  } else {
    cerebroArchivo.vistaActual = props.vistaInicial;
  }
});

watch(
  () => ruta.query,
  () => {
    if (ruta.query.vista && posiblesVistas.includes(ruta.query.vista as Vistas)) {
      cerebroArchivo.vistaActual = ruta.query.vista as Vistas;
    } else {
      cerebroArchivo.vistaActual = props.vistaInicial;
    }
  }
);

function cambiarVista(llave: Vistas) {
  if (llave !== cerebroArchivo.vistaActual) {
    cerebroArchivo.vistaActual = llave;
    enrutador.push({
      path: ruta.path,
      query: { vista: llave },
    });
  }
}
</script>

<template>
  <!-- Rediseño 2026: píldoras con texto en lugar de íconos, como en «Clasificación por temas». -->
  <div id="filtrosVistas" role="group" aria-label="Cambiar vista">
    <span class="etiquetaOrdenar">Ver</span>
    <button
      v-for="vista in vistas"
      :key="`vista-${vista}`"
      type="button"
      class="botonOrden"
      :class="cerebroArchivo.vistaActual === vista ? 'activo' : ''"
      :aria-pressed="cerebroArchivo.vistaActual === vista"
      @click="cambiarVista(vista)"
    >
      {{ nombresVistas[vista] }}
    </button>
  </div>
</template>

<style lang="scss" scoped>
#filtrosVistas {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-right: 1em;
}

.etiquetaOrdenar {
  font-size: 13px;
  color: var(--textoSuave);
}

.botonOrden {
  height: 38px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid var(--bordeFuerte);
  background: transparent;
  color: var(--textoSuave);
  font-family: var(--fuenteSans);
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    border-color: var(--ocre);
  }

  &.activo {
    border-color: var(--ocre);
    color: var(--ocre);
    font-weight: 700;
  }
}
</style>
