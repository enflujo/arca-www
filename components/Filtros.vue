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
const listaImgs = import.meta.glob('~~/assets/imgs/botones/*.svg', { eager: true });
const imagenDinamica = (vista) => {
  const img = listaImgs[`/assets/imgs/botones/boton_${vista}.svg`];
  if (!img) return null;
  return img.default;
};

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
  <div id="filtros">
    <img
      v-for="vista in vistas"
      :key="vista"
      class="filtro"
      :class="cerebroArchivo.vistaActual === vista ? 'activo' : ''"
      :src="imagenDinamica(vista)"
      @click="cambiarVista(vista)"
    />
  </div>
</template>

<style lang="scss" scoped>
#filtros {
  display: flex;
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
