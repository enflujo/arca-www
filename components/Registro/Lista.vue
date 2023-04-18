<script setup>
const props = defineProps({
  datos: Array,
  titulo: String,
  relacion: String,
  ruta: String,
});

const url = (elemento) => {
  if (elemento.ruta) return elemento.ruta;
  return `/${props.ruta}/${elemento[props.relacion].slug}`;
};
</script>

<template>
  <section v-if="datos.length" class="seccion">
    <h3>{{ titulo }}</h3>
    <ul class="lista contenido">
      <li v-for="(elemento, i) in datos" :key="`elemento${ruta}${i}`">
        <NuxtLink :to="url(elemento)">
          {{ relacion ? elemento[relacion].nombre : elemento.nombre }}
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>

<style lang="scss" scoped>
.lista {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;

  li {
    border: 1px solid $rojoCerezo;
    margin: 0 0.2em 0.2em 0;
    height: fit-content;

    a {
      padding: 0.4em;
      display: block;
    }

    &:hover {
      background-color: $rojoCerezo;

      a,
      a:link {
        color: $claridad;
      }
    }
  }
}
</style>
