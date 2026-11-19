<script setup lang="ts">
import type { ImagenPagina } from '~/utilidades/contenidoCMS';

// Open Source · diseño «Recursos · Open Source-html»
defineProps<{ seccion: string; imagen?: ImagenPagina }>();

const repositorios = [
  { nombre: 'API', texto: 'Los datos de la colección, servidos para cualquier consulta.', repo: 'enflujo/arca-api' },
  { nombre: 'Sitio', texto: 'El código del portal público de ARCA.', repo: 'enflujo/arca-www' },
  {
    nombre: 'Procesamiento',
    texto: 'Los pasos de despliegue y preparación de los datos.',
    repo: 'enflujo/arca-despliegue',
  },
  { nombre: 'Analítica', texto: 'Los cálculos y visualizaciones del tablero.', repo: 'enflujo/arca-analitica' },
];
</script>

<template>
  <div class="encabezadoPagina">
    <p class="ceja">{{ seccion }}</p>
    <h1 class="tituloPagina">Open Source</h1>
  </div>

  <p class="entradilla">Todo el desarrollo de ARCA es abierto. Estos son los cuatro repositorios del proyecto.</p>

  <ul class="repositorios">
    <li v-for="r in repositorios" :key="r.repo">
      <a :href="`https://github.com/${r.repo}`" target="_blank" rel="noopener" class="panelClaro repositorio">
        <svg class="icono" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />
        </svg>
        <span class="nombre">{{ r.nombre }}</span>
        <span class="descripcion">{{ r.texto }}</span>
        <span class="repo">{{ r.repo }}</span>
        <svg class="flecha" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8" /></svg>
      </a>
    </li>
  </ul>

  <div class="cierre">
    <p>
      El código se publica en GitHub bajo la cuenta de EnFlujo, el laboratorio que desarrolló el portal y el modelado de
      datos.
    </p>
    <figure v-if="imagen" class="figura">
      <img :src="imagen.src" :alt="imagen.alt" loading="lazy" />
      <PaginasCredito :imagen="imagen" />
    </figure>
  </div>
</template>

<style lang="scss" scoped>
.repositorios {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.repositorio {
  border-radius: 14px;
  padding: 20px 24px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 6px 18px;
  transition: border-color 0.2s ease;

  &:link,
  &:visited {
    color: var(--tinta);
  }

  &:hover {
    border-color: var(--ocre);
  }

  svg {
    fill: none;
    stroke: var(--ocre);
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .icono {
    width: 26px;
    height: 26px;
    stroke-width: 1.6;
  }

  .flecha {
    width: 16px;
    height: 16px;
    stroke-width: 2;
  }

  .nombre {
    font-family: var(--fuenteSerif);
    font-size: 26px;
  }

  .descripcion {
    grid-column: 1 / -1;
    font-size: 15.5px;
    color: #2b2018;
  }

  .repo {
    grid-column: 1 / -1;
    font-size: 14px;
    font-weight: 600;
    color: var(--ocre);
  }
}

.cierre {
  display: flex;
  flex-direction: column;
  gap: 28px 40px;
  padding-top: 40px;

  p {
    margin: 0;
    flex-grow: 1;
    font-family: var(--fuenteSerif);
    font-size: clamp(19px, 1.6vw, 21px);
    line-height: 1.55;
    color: #d8c9b2;
  }
}

.figura {
  margin: 0;

  img {
    width: 100%;
    aspect-ratio: 460 / 240;
    object-fit: cover;
    object-position: center 12%;
    border-radius: 12px;
    display: block;
  }
}

@media (min-width: $minTablet) {
  .repositorio {
    grid-template-columns: 26px 180px 1fr auto 16px;
    gap: 24px;
    padding: 24px 28px;

    .descripcion,
    .repo {
      grid-column: auto;
    }

    .repo {
      white-space: nowrap;
    }
  }

  .cierre {
    flex-direction: row;
    align-items: center;
  }

  .figura {
    width: clamp(300px, 40%, 460px);
    flex-shrink: 0;
  }
}
</style>
