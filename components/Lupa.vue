<script setup>
import { demorar, esperar } from '~/utilidades/ayudas';

const props = defineProps({
  src: String,
  alt: String,
  ancho: { default: 150 },
  alto: { default: 150 },
  anchoBorde: { default: 1.2 },
  escala: { default: 1.5 },
  bordeColor: { default: '#fff' },
  desbordar: { default: true },
  activado: { default: true },
  tactoPos: { default: { x: -50, y: -50 } },
});

const img = ref(null);
const lupa = ref(null);
const dims = ref(null);
const mostrarLupa = ref(false);
const mov = ref({ x: 0, y: 0 });
const pos = ref({ x: 0, y: 0 });
const centro = ref({ x: 0, y: 0 });

const definirLupa = computed(() => {
  if (!dims.value) return;
  const { escala, ancho, alto, anchoBorde, bordeColor } = props;
  const { x, y } = pos.value;
  const { width, height } = dims.value;
  const { x: centroX, y: centroY } = centro.value;

  return {
    left: `calc(${x * 100}% - ${centroX}px + ${mov.value.x}px - ${anchoBorde}px)`,
    top: `calc(${y * 100}% - ${centroY}px + ${mov.value.y}px - ${anchoBorde}px)`,
    backgroundPosition: `calc(${x * 100}% + ${centroX}px - ${x * ancho}px) calc(${y * 100}% + ${centroY}px - ${
      y * alto
    }px)`,
    backgroundSize: `${escala * width}% ${escala * height}%`,
    borderWidth: `${anchoBorde}px`,
    backgroundColor: bordeColor,
  };
});

const calcularDimsImg = () => {
  if (img.value) {
    dims.value = img.value.getBoundingClientRect();
  }
};

const apagarLupa = () => {
  mostrarLupa.value = false;
};

const movimientoRaton = demorar((e) => {
  if (dims.value) {
    const { target, clientX, clientY } = e;
    const { left, top } = dims.value;

    pos.value = {
      x: (clientX - left) / target.clientWidth,
      y: (clientY - top) / target.clientHeight,
    };

    mostrarLupa.value = true;
  }
}, 20);

const movimientoTacto = demorar((e) => {
  if (dims.value) {
    const { target, targetTouches } = e;
    const { left, top } = dims.value;
    const [_x, _y] = targetTouches[0];

    const x = (_y - left) / target.clientWidth;
    const y = (_y - top) / target.clientHeight;

    if (x >= 0 && y >= 0 && x <= 1 && y <= 1) {
      mov.value = tactoPos;
      pos.value = { x, y };
      mostrarLupa.value = true;
    } else {
      mostrarLupa.value = false;
    }
  }
}, 20);

const calcularDimsImgEsperando = esperar(calcularDimsImg, 200);

onMounted(() => {
  window.addEventListener('resize', calcularDimsImgEsperando);
  window.addEventListener('scroll', calcularDimsImgEsperando, true);

  Object.assign(lupa.value.style, {
    backgroundImage: `url(${props.src})`,
    width: `${props.ancho}px`,
    height: `${props.alto}px`,
  });

  centro.value = { x: props.ancho / 2, y: props.alto / 2 };
});

onUnmounted(() => {
  window.removeEventListener('resize', calcularDimsImgEsperando);
  window.removeEventListener('scroll', calcularDimsImgEsperando, true);
});
</script>

<template>
  <div :class="`contenedorLupa`" :style="`overflow: ${desbordar ? 'visible' : 'hidden'}`">
    <img
      ref="img"
      :src="src"
      :alt="alt"
      class="imagen"
      @load="calcularDimsImg"
      @mouseenter="calcularDimsImg"
      @mousemove="movimientoRaton"
      @mouseout="apagarLupa"
      @touchstart.prevent="calcularDimsImg"
      @touchmove.prevent="movimientoTacto"
      @touchend="apagarLupa"
    />

    <div class="lupa" ref="lupa" :class="mostrarLupa && activado ? 'visible' : ''" :style="definirLupa" />
  </div>
</template>

<style lang="scss" scoped>
.contenedorLupa {
  position: relative;
  display: inline-block;
  line-height: 0;
  // width: 40%;
}

.imagen {
  cursor: none;
  width: 100%;
  max-width: 90vw;
  height: auto;
}
.lupa {
  position: absolute;
  z-index: 1;
  background: #fff no-repeat;
  border: solid #ebebeb;
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;

  &.visible {
    opacity: 1;
  }
}
</style>
