<script setup lang="ts">
import type { ImagenPagina } from '~/utilidades/contenidoCMS';

// Sobre ARCA · diseño «Sobre ARCA-html»
defineProps<{ seccion: string; imagen?: ImagenPagina }>();
</script>

<template>
  <div class="encabezadoPagina">
    <p class="ceja">{{ seccion }}</p>
    <h1 class="tituloPagina">Sobre ARCA</h1>
  </div>

  <div class="sobreArca">
    <div class="columnaTexto">
      <p class="entradilla grande sinMargen">
        Esta nueva versión de ARCA es una base de datos relacional e interactiva. Esta característica permite navegar
        por las distintas colecciones, desde cualquier lugar, para hacer lecturas personales de temas. Cuenta con un
        nuevo modelado de datos y una revisión de toda la estructura de información.
      </p>

      <div class="panelClaro panelTexto">
        <p>
          Desde aquí se tiene acceso a diferentes formas de observar los datos de las pinturas a través de colecciones
          de elementos tradicionales, como su artífice, técnica o lugar de producción. Pero también se puede hacer
          colecciones a través de los metadatos que han surgido de la investigación: gestos quirológicos, tipos de
          paisaje, composiciones de género, por objetos, símbolos, etc. Los metadatos ayudan a navegar las imágenes
          temáticamente.
        </p>
        <p>
          En algunos apartados, como autores, gestos o personajes representados, se aporta información básica contextual
          que ayuda a interpretar las imágenes. La georreferencia se ha tratado de ubicar lo más preciso posible.
        </p>
        <p>
          La composición y análisis de los datos sigue la información que aportan las fuentes de las imágenes. En
          ocasiones se ha renombrado algunas obras con respecto a la información original, especialmente las religiosas.
        </p>
        <div class="contacto">
          <p class="avisoContacto">
            Puede haber información que no es precisa. Si tiene comentarios o precisiones, por favor contáctenos.
          </p>
          <a href="mailto:jborja@uniandes.edu.co" class="botonOcre">
            Escribirnos
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </a>
        </div>
      </div>

      <div class="pieSobre">
        <a href="https://zenodo.org/records/10864546" class="pildora" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M10 13a4 4 0 006 .5l2-2a4 4 0 00-6-6l-1 1" />
            <path d="M14 11a4 4 0 00-6-.5l-2 2a4 4 0 006 6l1-1" />
          </svg>
          DOI 10.5281/zenodo.10864546
        </a>
        <div class="direccion">
          <span class="etiquetaDireccion">Dirección del proyecto</span>
          <a
            href="https://cienciassociales.uniandes.edu.co/historia-geografia/profesores/jaime-borja/"
            target="_blank"
            rel="noopener"
            class="nombreDirector"
          >
            Jaime H. Borja G.
          </a>
        </div>
      </div>
    </div>

    <figure v-if="imagen" class="figura">
      <div class="panelClaro marco">
        <img :src="imagen.src" :alt="imagen.alt" loading="lazy" />
      </div>
      <PaginasCredito :imagen="imagen" />
    </figure>
  </div>
</template>

<style lang="scss" scoped>
.sobreArca {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.columnaTexto {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.columnaTexto .sinMargen {
  margin: 0;
}

.panelTexto {
  padding: clamp(22px, 3vw, 32px);
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.contacto {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px 24px;
  flex-wrap: wrap;
  border-top: 1px solid #e0d3b8;
  padding-top: 22px;

  .avisoContacto {
    font-size: 16px;
    line-height: 1.6;
    flex: 1 1 260px;
  }
}

.pieSobre {
  display: flex;
  align-items: center;
  gap: 20px 32px;
  flex-wrap: wrap;
  border-top: 1px solid #3a2e27;
  padding-top: 24px;
}

.direccion {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.etiquetaDireccion {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--oro);
}

.nombreDirector {
  font-family: var(--fuenteSerif);
  font-size: 24px;

  &:link,
  &:visited {
    color: var(--sobreOscuro);
  }

  &:hover {
    color: var(--oro);
  }
}

.figura {
  margin: 0;
  display: flex;
  flex-direction: column;
}

.marco {
  border-radius: 16px;
  padding: 20px;
  display: flex;
  justify-content: center;

  img {
    width: 100%;
    max-width: 380px;
    aspect-ratio: 380 / 470;
    object-fit: cover;
    object-position: top center;
    border-radius: 10px;
    display: block;
  }
}

@media (min-width: $minPantalla) {
  .sobreArca {
    flex-direction: row;
    align-items: flex-start;
  }

  .figura {
    width: clamp(300px, 30vw, 420px);
    flex-shrink: 0;
  }
}
</style>
