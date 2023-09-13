<script setup lang="ts">
import type { ImagenArca, Punto } from 'tipos';
import { demorar, esperar, urlImagen } from '~/utilidades/ayudas';

interface Props {
  datos: ImagenArca;
  alt: string;
  ancho?: number;
  alto?: number;
  anchoBorde?: number;
  escala?: number;
  bordeColor?: string;
  desbordar?: boolean;
  activado?: boolean;
  tactoPos?: Punto;
}

const props = withDefaults(defineProps<Props>(), {
  anchoBorde: 1.2,
  escala: 1.5,
  bordeColor: '#fff',
  desbordar: true,
  activado: true,
  tactoPos: () => ({ x: -50, y: -50 }),
});

const img: Ref<HTMLImageElement | null> = ref(null);
const lupa: Ref<HTMLDivElement | null> = ref(null);
const dims: Ref<DOMRect | null> = ref(null);
const mostrarLupa = ref(false);
const mov = ref({ x: 0, y: 0 });
const pos = ref({ x: 0, y: 0 });

const definirLupa = computed(() => {
  if (!dims.value) return;
  const { escala, ancho, alto, anchoBorde, bordeColor } = props;
  const { x, y } = pos.value;
  const { width, height } = dims.value;
  const anchoLupa = ancho ? ancho : width / 2;
  const altoLupa = alto ? alto : Math.min(window.innerHeight / 2, height / 2);
  const centroX = anchoLupa / 2;
  const centroY = altoLupa / 2;
  const x2 = x * 100;
  const y2 = y * 100;

  return {
    left: `calc(${x2}% - ${centroX}px + ${mov.value.x}px - ${anchoBorde}px)`,
    top: `calc(${y2}% - ${centroY}px + ${mov.value.y}px - ${anchoBorde}px)`,
    backgroundPosition: `calc(${x2}% + ${centroX}px - ${x * anchoLupa}px) calc(${y2}% + ${centroY}px - ${
      y * altoLupa
    }px)`,
    backgroundSize: `${escala * width}px ${escala * height}px`,
    borderWidth: `${anchoBorde}px`,
    backgroundColor: bordeColor,
    width: `${anchoLupa}px`,
    height: `${altoLupa}px`,
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

const movimientoRaton = demorar(({ target, clientX, clientY }: MouseEvent) => {
  if (dims.value && target && target instanceof Element) {
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
      mov.value = props.tactoPos;
      pos.value = { x, y };
      mostrarLupa.value = true;
    } else {
      mostrarLupa.value = false;
    }
  }
}, 20);

const calcularDimsImgEsperando = esperar(calcularDimsImg, 200);

onMounted(() => {
  if (props.datos) {
    const imagen = new Image();
    imagen.onload = () => {
      if (!img.value) return;
      img.value.src = imagen.src;
    };
    imagen.src = urlImagen(props.datos.id, 'obra');

    window.addEventListener('resize', calcularDimsImgEsperando);
    window.addEventListener('scroll', calcularDimsImgEsperando, true);

    if (lupa.value) {
      Object.assign(lupa.value.style, {
        backgroundImage: `url(${imagen.src})`,
      });
    }
  }
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
      :src="`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='black' viewBox='0 0 ${datos.ancho} ${datos.alto}'%3E%3C/svg%3E`"
      :alt="alt"
      class="imagen"
      :style="`cursor:${activado ? 'none' : 'initial'}`"
      @click="calcularDimsImgEsperando"
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
}

.imagen {
  width: 100%;
  max-width: 90vw;
  height: auto;
  background-image: url(/arca-icono.svg);
  background-repeat: no-repeat;
  background-size: 50px;
  background-position: center;
  line-height: 0;
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
