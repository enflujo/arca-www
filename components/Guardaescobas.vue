<script setup lang="ts">
interface Props {
  completo: boolean;
}

withDefaults(defineProps<Props>(), { completo: true });
</script>

<template>
  <footer id="pie">
    <div class="marcaPie">
      <span class="marca">ARCA</span>
      <span class="lema">Arte Colonial Americano</span>
      <p class="descripcion">Base de datos de la pintura producida en las Américas entre 1530 y 1830.</p>
    </div>

    <!-- Créditos con los nombres enlazados (rediseño 2026). El contacto va en «Citar y contactar». -->
    <div class="creditos">
      <h2 class="etiqueta">Créditos</h2>
      <p>
        Proyecto de
        <a
          class="nombre"
          href="https://cienciassociales.uniandes.edu.co/historia-geografia/profesores/jaime-borja/"
          target="_blank"
          rel="noopener"
          >Jaime H. Borja Gómez</a
        >, Profesor Titular, Departamento de Historia y Geografía, Universidad de los Andes (Bogotá – Colombia).
      </p>
      <p>
        Desarrollo digital y modelado de datos:
        <a
          class="nombre"
          href="https://artehum.uniandes.edu.co/profesores/juan-camilo-gonzalez/"
          target="_blank"
          rel="noopener"
          >Juan Camilo González</a
        >
        –
        <a class="nombre" href="https://enflujo.com/" target="_blank" rel="noopener">EnFlujo</a>
      </p>
      <p>Centro de Estudios en Periodismo (CEPER) – Universidad de los Andes</p>
      <p>
        Diseño y desarrollo de sección «Visualización y análisis» y rediseño sitio web versión 2026<br />
        <a class="nombre" href="https://www.linkedin.com/in/milenaot" target="_blank" rel="noopener"
          >Angela Milena Ortiz Torres</a
        >
      </p>
    </div>

    <div class="citar">
      <h2 class="etiqueta">Citar y contactar</h2>
      <a class="doi" href="https://doi.org/10.5281/zenodo.10864546" target="_blank" rel="noopener">
        DOI 10.5281/zenodo.10864546
      </a>
      <p><a href="mailto:jborja@uniandes.edu.co">jborja@uniandes.edu.co</a></p>
      <p class="aviso">
        La información de los registros visuales se basa en información que provee las fuentes de las imágenes. Es
        posible que algunos datos no sean precisos. Si tiene comentarios, escríbanos.
      </p>
    </div>

    <p class="legal">
      <span>Universidad de los Andes · Bogotá, Colombia</span>
      <span>
        Las imágenes pertenecen a sus instituciones de origen. Consulta las condiciones en
        <NuxtLink to="/bibliografia-y-referencias">Uso de imágenes</NuxtLink>.
      </span>
    </p>
  </footer>
</template>

<style lang="scss">
#pie {
  background-color: var(--papel);
  color: var(--textoSuave);
  border-top: 1px solid var(--borde);
  padding: 2em 1.5em 1em;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.4em;
  font-size: 12.5px;
  line-height: 1.5;

  p {
    margin: 0 0 0.6em;
  }

  a,
  a:link {
    color: var(--tinta);

    &:hover {
      color: var(--ocre);
    }
  }

  .marca {
    display: block;
    font-family: var(--fuenteSerif);
    font-size: 2.1em;
    line-height: 1;
    color: var(--tinta);
  }

  .lema {
    display: block;
    margin: 0.3em 0 0.7em;
    font-family: var(--fuenteSerif);
    font-style: italic;
    font-size: 1.15em;
    color: var(--ocre);
  }

  .etiqueta {
    margin: 0 0 0.8em;
    font-family: var(--fuenteSans);
    font-size: 0.8em;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--ocre);
  }

  .doi {
    display: inline-block;
    margin-bottom: 0.8em;
    padding: 0.4em 0.9em;
    border: 1px solid var(--borde);
    border-radius: 999px;
    font-weight: 500;
  }

  .aviso {
    font-size: 0.9em;
  }

  // Un espacio claro entre cada contribución.
  .creditos p {
    margin: 0 0 0.8em;

    &:last-child {
      margin-bottom: 0;
    }
  }

  // Nombres resaltados y enlazados.
  .nombre {
    font-weight: 600;
    border-bottom: 1px solid var(--bordeFuerte);
    transition:
      color 0.2s ease,
      border-color 0.2s ease;

    &:link,
    &:visited {
      color: var(--tinta);
    }

    &:hover {
      color: var(--ocre);
      border-bottom-color: var(--ocre);
    }
  }

  .legal {
    grid-column: 1 / -1;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 0.8em 2em;
    margin: 0;
    padding-top: 1.5em;
    border-top: 1px solid var(--borde);
    font-size: 0.88em;
  }
}

@media (min-width: $minTablet) {
  #pie {
    grid-template-columns: 1fr 1fr;
    padding: 2.2em 2.5em 1.2em;
  }
}

@media (min-width: $minPantalla) {
  #pie {
    grid-template-columns: 1fr 1.6fr 1fr;
    gap: 2.2em;
    padding: 2.2em 3.5em 1.2em;
  }
}
</style>
