<script setup>
defineProps({
  datos: Object,
  nivel: Number,
  color: Function,
  ejeX: Function,
  clicSubCategorias: Function,
});
</script>

<template>
  <ul class="categoriaSubNivel">
    <li v-for="categoria in datos" :key="`categoria2${categoria.id}`" class="subCategoria">
      <span
        v-if="nivel <= 5 && categoria[`categorias${nivel + 1}_func`].count > 0"
        class="mostrar"
        :class="categoria.mostrarSubCategoria ? 'abierto' : 'cerrado'"
        @click="clicSubCategorias(nivel, categoria)"
      />
      <span v-else class="mostrar sinSubNivel"></span>

      <NuxtLink :to="`/categorias${nivel}/${categoria.slug}`" class="subCategoriaTitulo">
        {{ categoria.nombre }}
      </NuxtLink>

      <GraficaColombina
        :color="color(categoria.obras_func.count)"
        :ancho="ejeX(categoria.obras_func.count)"
        :alto="1"
        :radio="6"
        :total="categoria.obras_func.count"
      />

      <CategoriasSubNivel
        v-if="nivel <= 5 && categoria[`categorias${nivel + 1}`] && categoria.mostrarSubCategoria"
        :datos="categoria[`categorias${nivel + 1}`]"
        :nivel="nivel + 1"
        :color="color"
        :ejeX="ejeX"
        :clicSubCategorias="clicSubCategorias"
      />
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.subCategoria {
  display: flex;
  flex-wrap: wrap;
}

.subCategoriaTitulo {
  display: inline-block;
  font-size: 0.85em;
  vertical-align: top;
}

.colombina {
  flex-grow: 1;
  padding-left: 0.3em;
}

.categoriaSubNivel {
  margin-left: 1.3em;
  flex-basis: 100%;

  .mostrar {
    margin-right: 0.5em;
  }
}
</style>
