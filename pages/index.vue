<script setup>
import { usarGeneral } from '~~/cerebros/general';

const general = usarGeneral();

// El título en este caso es nulo ya que el título que pasamos a esta función se vuelve el subtítulo,
// al ser la página inicial no se necesita.
useHead(elementosCabeza({ titulo: null }, '/'));
</script>

<template>
  <div>
    <div id="portada">
      <Logo class="svgClaro" />
      <h1 class="titulo logo-texto claridad">{{ general.titulo }}</h1>
      <h2 class="subtitulo">{{ general.descripcion }}</h2>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:color';

#portada {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 99vh;
  width: 100%;
  z-index: 1;
  background-attachment: fixed;
  background-image: url(@/assets/imgs/background-image.png);
  background-repeat: no-repeat;
  background-size: cover;
}

#logoArca {
  width: 125px;
  margin-top: 10px;
  display: block;
  position: relative;
  color: $claridad;
}

.titulo {
  font-size: 3em;
  margin: 0;
  z-index: 10;
}

.claridad {
  color: $claridad;
}

.logo-texto {
  letter-spacing: 1px;
  text-transform: uppercase;
}

.svgClaro {
  fill: $claridad;
}

.subtitulo {
  font-size: 1.4em;
  color: $claridad;
  font-weight: 400;
  text-transform: uppercase;
  width: 400px;
  text-align: center;
  font-family: $fuenteMenu;
  letter-spacing: 5px;
  z-index: 10;
}

// Teléfonos horizontal
@media (min-width: $minCelular) {
}

// Pantallas medianas (Tablets)
@media (min-width: $minTablet) {
}

// Dispositivos grandes y pantallas medianas
@media (min-width: $minPantalla) {
}

// Pantallas grandes
@media (min-width: $minPantallaGrande) {
}
</style>
