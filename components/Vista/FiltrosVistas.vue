<script setup>
import { usarArchivo } from '~~/cerebros/archivo';

const ruta = useRoute();
const enrutador = useRouter();
const props = defineProps({
  vistaInicial: { type: String, default: '' },
  vistas: { type: Array, default: () => [] },
});
const cerebroArchivo = usarArchivo();
const posiblesVistas = ['mapa', 'abc', 'colombinas'];

onMounted(() => {
  if (ruta.query.vista && posiblesVistas.includes(ruta.query.vista)) {
    cerebroArchivo.vistaActual = ruta.query.vista;
  } else {
    cerebroArchivo.vistaActual = props.vistaInicial;
  }
});

watch(
  () => ruta.query,
  () => {
    if (ruta.query.vista && posiblesVistas.includes(ruta.query.vista)) {
      cerebroArchivo.vistaActual = ruta.query.vista;
    } else {
      cerebroArchivo.vistaActual = props.vistaInicial;
    }
  }
);

function cambiarVista(llave) {
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
