<script setup lang="ts">
import type { ImagenPagina } from '~/utilidades/contenidoCMS';

// Productos relacionados · diseño «Recursos · Productos relacionados-html»
defineProps<{ seccion: string; imagen?: ImagenPagina }>();
</script>

<template>
  <div class="encabezadoPagina">
    <p class="ceja">{{ seccion }}</p>
    <h1 class="tituloPagina">Productos relacionados</h1>
  </div>

  <p class="entradilla">Publicaciones y desarrollos que salen de esta base de datos.</p>

  <article class="panelClaro producto">
    <div class="texto">
      <span class="tipo">E-book</span>
      <h2>Los ingenios del pincel</h2>
      <p class="subtitulo">Geografía de la pintura y cultura visual en América colonial</p>
      <p class="autor">Jaime H. Borja Gómez</p>
      <p>
        El e-book es un resultado de esta base de datos. El libro analiza, con base en la minería de datos, las
        características de los temas de la pintura colonial americana. Pero además de introducirse en la cultura visual
        americana, el texto se propone como un e-book no encapsulado: se trata de una propuesta no argumental y no
        lineal, hipertextual, interactiva e inmersiva.
      </p>
      <p>
        Está compuesto por 85 entradas que se pueden leer en cualquier dirección. Cada entrada sugiere otras entradas,
        relacionadas con distintos recursos visuales, documentales, narrativos, videos, infografías, documentos,
        gráficos, mosaicos y mapas.
      </p>
      <div class="chips">
        <span class="chipPanel">85 entradas</span>
        <span class="chipPanel">Lectura no lineal</span>
        <span class="chipPanel">Hipertextual e inmersivo</span>
      </div>
      <a
        href="https://losingeniosdelpincel.uniandes.edu.co/#!/intro/1"
        class="botonOcre"
        target="_blank"
        rel="noopener"
      >
        Abrir el e-book
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8" /></svg>
      </a>
    </div>

    <figure v-if="imagen" class="portada">
      <a href="https://losingeniosdelpincel.uniandes.edu.co/#!/intro/1" target="_blank" rel="noopener" tabindex="-1">
        <img :src="imagen.src" :alt="imagen.alt" loading="lazy" />
      </a>
      <!-- Vínculo visible debajo de la imagen, además del botón. -->
      <figcaption>
        <a
          class="vinculoVisible"
          href="https://losingeniosdelpincel.uniandes.edu.co/#!/intro/1"
          target="_blank"
          rel="noopener"
          >https://losingeniosdelpincel.uniandes.edu.co/#!/intro/1</a
        >
      </figcaption>
    </figure>
  </article>
</template>

<style lang="scss" scoped>
.producto {
  padding: clamp(22px, 3vw, 32px);
  display: flex;
  flex-direction: column-reverse;
  gap: 28px 36px;
}

.texto {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;

  h2 {
    margin: 0;
    font-family: var(--fuenteSerif);
    font-weight: 400;
    font-size: clamp(28px, 2.6vw, 36px);
    line-height: 1.05;
    color: var(--tinta);
  }

  .subtitulo {
    font-family: var(--fuenteSerif);
    font-style: italic;
    font-size: clamp(17px, 1.5vw, 20px);
    line-height: 1.3;
    color: var(--ocre);
  }

  .autor {
    font-size: 15px;
    color: #8a6a45;
  }

  p {
    line-height: 1.6;
  }

  .botonOcre {
    align-self: flex-start;
    min-height: 52px;
    padding: 0 26px;
    font-size: 16px;
    margin-top: 8px;
  }
}

.tipo {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ocre);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding-top: 4px;
}

.portada {
  margin: 0;

  figcaption {
    margin-top: 10px;
    font-size: 13px;
    overflow-wrap: anywhere;
  }
}

.vinculoVisible {
  &:link,
  &:visited {
    color: var(--ocre);
    border-bottom: 1px solid var(--bordeFuerte);
  }

  &:hover {
    color: var(--ocreOscuro);
  }
}

.portada img {
  width: 100%;
  aspect-ratio: 540 / 420;
  object-fit: cover;
  border-radius: 12px;
  display: block;
}

@media (min-width: $minPantalla) {
  .producto {
    flex-direction: row;
    align-items: flex-start;
  }

  .portada {
    width: clamp(340px, 52%, 540px);
    flex-shrink: 0;
  }
}
</style>
