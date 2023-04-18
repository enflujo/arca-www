<script setup>
const props = defineProps({
  datos: Object,
  ejeX: Function,
  ejeY: Function,
  color: { type: String, default: '#000' },
  opacidad: { type: String, default: '1' },
  radioPuntos: { type: String, default: '1.5' },
  anchoLinea: { type: String, default: '0.5' },
});

const lineaSvg = computed(() => {
  let linea = '';
  let contador = 0;

  for (const año in props.datos) {
    const x = props.ejeX(año);
    const y = props.ejeY(props.datos[año].length);

    if (contador === 0) {
      linea += `M${x} ${y}`;
    } else {
      linea += ` L${x} ${y}`;
    }

    contador++;
  }

  // props.datos.forEach((instancia, i) => {
  //   const x = props.posicionX(instancia.fecha_inicial);
  //   const y = props.posicionY(instancia.porcentaje);

  //   if (i === 0 || instancia.anno != añoInicial) {
  //     linea += `M${x} ${y}`;
  //     paso = instancia.anno - añoInicial;
  //     añoInicial += paso;
  //   } else {
  //     linea += ` L${x} ${y}`;
  //   }
  //   añoInicial += 1;
  // })

  return linea;
});
</script>

<template>
  <g :stroke="color" :fill="color" :opacity="opacidad">
    <path
      :d="lineaSvg"
      class="lineaDatos"
      fill="none"
      :stroke-width="anchoLinea"
      shape-rendering="geometricPrecision"
    />

    <circle
      v-for="(grupo, año) in datos"
      :key="`punto-${año}`"
      class="puntoDatos"
      :cx="ejeX(año)"
      :cy="ejeY(grupo.length)"
      :r="radioPuntos"
    />
  </g>
</template>
