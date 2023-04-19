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

  props.datos.forEach((obj, i) => {
    const x = props.ejeX(obj.fecha);
    const y = props.ejeY(obj.cantidad);

    if (i === 0) {
      linea += `M${x} ${y}`;
    } else {
      linea += ` L${x} ${y}`;
    }
  });
  // for (const año in props.datos) {
  //   const x = props.ejeX(año);
  //   const y = props.ejeY(props.datos[año].length);

  //   if (contador === 0) {
  //     linea += `M${x} ${y}`;
  //   } else {
  //     linea += ` L${x} ${y}`;
  //   }

  //   contador++;
  // }

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
      v-for="d in datos"
      :key="`punto-${d.fecha}`"
      class="puntoDatos"
      :cx="ejeX(d.fecha)"
      :cy="ejeY(d.cantidad)"
      :r="radioPuntos"
    />
  </g>
</template>
