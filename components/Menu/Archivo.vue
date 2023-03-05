<script setup>
const ruta = useRoute();

const opciones = [
  { nombre: 'Autores', slug: 'autores' },
  { nombre: 'Categorías', slug: 'categorias' },
  { nombre: 'Escenarios', slug: 'escenarios' },
  { nombre: 'Técnicas', slug: 'tecnicas' },
  { nombre: 'Donantes', slug: 'donantes' },
  { nombre: 'Ubicaciones', slug: 'ubicaciones' },
  { nombre: 'Relatos Visuales', slug: 'relatos-visuales' },
  { nombre: 'Descriptores', slug: 'descriptores' },
  { nombre: 'Objetos', slug: 'objetos' },
  { nombre: 'Gestos', slug: 'gestos' },
  { nombre: 'Cartela - Filacteria', slug: 'cartela-filacteria' },
  { nombre: 'Símbolos', slug: 'simbolos' },
  { nombre: 'Características Particulares', slug: 'caracteristicas-particulares' },
  { nombre: 'Fisiognómica', slug: 'fisiognomica' },
  { nombre: 'Fisiognómica Imagen', slug: 'fisiognomica-imagen' },
  { nombre: 'Personajes', slug: 'personajes' },
  { nombre: 'Rostros', slug: 'rostros' },
];

const esRutaActual = (slug) => {
  const partes = ruta.path.split('/');

  if (!partes[2]) return false;

  if (partes[2].includes('categorias')) {
    return slug === 'categorias';
  } else if (partes[2] === 'paises') {
    return slug === 'ubicaciones';
  }
  return partes.includes(slug);
};
</script>

<template>
  <aside>
    <nav id="opciones">
      <NuxtLink
        :to="`/archivo/${opcion.slug}`"
        v-for="opcion in opciones"
        :key="opcion.slug"
        class="opcion"
        :class="esRutaActual(opcion.slug) ? 'activo' : ''"
      >
        {{ opcion.nombre }}
      </NuxtLink>
    </nav>
  </aside>
</template>

<style lang="scss" scoped>
@use 'sass:color';

#opciones {
  text-transform: uppercase;
  margin: 0 0 3em 1.8em;
  display: flex;
  flex-direction: column;
  padding: 2em 0 3em 0;
}

.opcion {
  font-size: 0.9em;
  margin-top: 0.9em;
  overflow: hidden;
  padding-left: 1.4em;
  color: var(--mediana);
  font-family: var(--fuenteMenu);
  font-weight: bold;

  &:hover {
    color: darken($mediana, 10%);
  }

  &.activo {
    color: darken($mediana, 20%);
  }
}
</style>
