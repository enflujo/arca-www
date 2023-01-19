<script setup>
const ruta = useRoute();
console.log(ruta.params);
</script>

<template>
  <h1>Categoria</h1>
  <Galeria coleccion="categorias" paginaActual="Categorias" singular="Categoria" />
</template>
