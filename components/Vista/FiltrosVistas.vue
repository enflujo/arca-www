<script setup lang="ts">
import { usarArchivo } from '~~/cerebros/archivo';

interface Props {
  vistaInicial: string;
  vistas: string[];
}

const props = withDefaults(defineProps<Props>(), {
  vistaInicial: '',
});

const ruta = useRoute();
const enrutador = useRouter();
const cerebroArchivo = usarArchivo();
const posiblesVistas = ['mapa', 'abc', 'colombinas'];

onMounted(() => {
  if (ruta.query.vista && posiblesVistas.includes(ruta.query.vista as string)) {
    cerebroArchivo.vistaActual = ruta.query.vista as string;
  } else {
    cerebroArchivo.vistaActual = props.vistaInicial;
  }
});

watch(
  () => ruta.query,
  () => {
    if (ruta.query.vista && posiblesVistas.includes(ruta.query.vista as string)) {
      cerebroArchivo.vistaActual = ruta.query.vista as string;
    } else {
      cerebroArchivo.vistaActual = props.vistaInicial;
    }
  }
);

function cambiarVista(llave: string) {
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
  <div id="filtrosVistas">
    <VistaIconos
      v-for="vista in vistas"
      :key="vista"
      class="filtro"
      :class="cerebroArchivo.vistaActual === vista ? 'activo' : ''"
      :vista="vista"
      @click="cambiarVista(vista)"
    />
  </div>
</template>

<style lang="scss" scoped>
#filtrosVistas {
  display: flex;
  margin-right: 1em;
}

.filtro {
  height: 25px;
  width: auto;
  cursor: pointer;
  opacity: 0.3;
  transition: opacity 0.3s ease-in-out;
  margin: 0.3em;

  &.activo {
    opacity: 1;
  }

  &:hover {
    opacity: 0.8;
  }
}
</style>
