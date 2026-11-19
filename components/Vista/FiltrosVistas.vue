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
const iconosVistas: Record<Vistas, string> = { abc: '≡', colombinas: '▤', mapa: '◎' };
const textosVistas: Record<Vistas, string> = {
  abc: 'en orden alfabético',
  colombinas: 'ordenado por cantidad de obras, con una gráfica',
  mapa: 'en un mapa',
};

/** «en un mapa, en orden alfabético u ordenado por cantidad de obras…». */
const explicacion = computed(() => {
  const partes = props.vistas.map((v) => textosVistas[v]);
  const ultima = partes.pop();
  const conjuncion = /^o/i.test(ultima ?? '') ? 'u' : 'o';
  const texto = partes.length ? `${partes.join(', ')} ${conjuncion} ${ultima}` : (ultima ?? '');
  return `${texto.charAt(0).toUpperCase()}${texto.slice(1)}.`;
});

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
  <!-- Rediseño 2026: control segmentado destacado, para que se note que el índice se puede ver de varias maneras. -->
  <div id="filtrosVistas">
    <p class="explicacion">
      <strong>Este índice se puede ver de {{ vistas.length === 3 ? 'tres' : 'dos' }} maneras:</strong>
      {{ explicacion }}
    </p>
    <div class="segmentos" role="group" aria-label="Cambiar la forma de ver el índice">
      <button
        v-for="vista in vistas"
        :key="`vista-${vista}`"
        type="button"
        class="segmento"
        :class="cerebroArchivo.vistaActual === vista ? 'activo' : ''"
        :aria-pressed="cerebroArchivo.vistaActual === vista"
        @click="cambiarVista(vista)"
      >
        <span class="icono" aria-hidden="true">{{ iconosVistas[vista] }}</span>
        {{ nombresVistas[vista] }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#filtrosVistas {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px 20px;
  width: 100%;
  padding: 12px 14px;
  margin-bottom: 4px;
  border-radius: 12px;
  background-color: var(--arena);
}

.explicacion {
  margin: 0;
  flex: 1 1 260px;
  font-size: 13.5px;
  line-height: 1.45;
  color: var(--textoCuerpo);

  strong {
    color: var(--ocreOscuro);
  }
}

.segmentos {
  display: inline-flex;
  padding: 3px;
  gap: 3px;
  border-radius: 999px;
  background-color: var(--papel);
  border: 1px solid var(--bordeFuerte);
}

.segmento {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding: 0 16px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--textoCuerpo);
  font-family: var(--fuenteSans);
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    color: var(--ocre);
  }

  &.activo {
    background-color: var(--ocre);
    color: var(--papel);
  }

  .icono {
    font-size: 15px;
  }
}
</style>
