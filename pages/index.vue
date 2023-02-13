<script setup>
import { usarGeneral } from '~~/cerebros/general';
import { gql, urlImagen } from '~~/utilidades/ayudas';

const general = usarGeneral();

// El título en este caso es nulo ya que el título que pasamos a esta función se vuelve el subtítulo,
// al ser la página inicial no se necesita.
useHead(elementosCabeza({ titulo: null }, '/'));

const Portada = gql`
  query {
    general {
      portada {
        id
        title
      }
    }
  }
`;

const { data, pending } = obtenerDatosAsinc('portada', Portada);
const imgPortada = ref(null);

watch(data, ({ general }) => {
  imgPortada.value = urlImagen(general.portada.id, 'portada');
});
</script>

<template>
  <Cargador v-if="pending" />
  <div v-else id="portada" :style="`background-image:url(${imgPortada})`">
    <Logo class="svgClaro" />
    <h1 class="titulo logo-texto claridad">{{ general.titulo }}</h1>
    <h2 class="subtitulo">{{ general.descripcion }}</h2>
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
  background-repeat: no-repeat;
  background-size: cover;
}

#logoArca {
  width: 125px;
  margin-top: 10px;
  display: block;
  position: relative;
  color: var(--claridad);
}

.titulo {
  font-size: 3em;
  margin: 0;
  z-index: 10;
}

.claridad {
  color: var(--claridad);
}

.logo-texto {
  letter-spacing: 1px;
  text-transform: uppercase;
}

.svgClaro {
  fill: var(--claridad);
}

.subtitulo {
  font-size: 1.4em;
  color: var(--claridad);
  font-weight: 400;
  text-transform: uppercase;
  width: 400px;
  text-align: center;
  font-family: var(--fuenteMenu);
  letter-spacing: 5px;
  z-index: 10;
}

// Teléfonos horizontal
@media (min-width: var(--minCelular)) {
}

// Pantallas medianas (Tablets)
@media (min-width: var(--minTablet)) {
}

// Dispositivos grandes y pantallas medianas
@media (min-width: var(--minPantalla)) {
}

// Pantallas grandes
@media (min-width: var(--minPantallaGrande)) {
}
</style>
