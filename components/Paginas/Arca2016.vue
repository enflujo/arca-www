<script setup lang="ts">
import type { ImagenPagina } from '~/utilidades/contenidoCMS';

// ARCA 2016–2022 · diseño «Sobre ARCA · 2016–2022-html»
defineProps<{ seccion: string; imagen?: ImagenPagina }>();

const cifras = [
  { etiqueta: 'Formas de acceso', valor: '3', texto: 'Por tema, autor y regiones' },
  { etiqueta: 'Categorías por tema', valor: '1.250', texto: 'Para ubicar con precisión los conjuntos visuales' },
  { etiqueta: 'Grandes temas', valor: '11', texto: 'Casi dos años de trabajo de clasificación' },
];
</script>

<template>
  <div class="encabezadoPagina">
    <p class="ceja">{{ seccion }}</p>
    <h1 class="tituloPagina">ARCA 2016–2022</h1>
  </div>

  <p class="entradilla grande">
    El primer portal de ARCA se desarrolló en 2016, con el objetivo de crear un archivo virtual que concentrara la
    producción pictórica colonial americana, dispersa en miles de colecciones públicas y privadas.
  </p>

  <div class="panelClaro panelColumnas">
    <div class="columna">
      <p>
        El primer portal de Arca se desarrolló en el 2016. El objetivo era crear un archivo virtual que concentrara la
        producción pictórica colonial americana, la cual se encuentra dispersa, textualmente, en miles de colecciones
        públicas y privadas —museos, iglesias, comunidades religiosas, coleccionistas, casas de subastas, redes sociales
        digitales, etc.—. Arca era una posibilidad para la recuperación de la información visual colonial a gran escala.
        Pero no se trataba solamente de crear un repositorio, también se buscaba proponer métodos de interpretación y
        análisis empleando los principios, desde la historia digital, del Big Data. Por esta razón, se generaron dos
        sistemas de visualización de datos: el primero, basado en Tableau; y el segundo, en la programación de un
        sencillo diagrama de fuerzas. De esta forma se podía hacer minería de datos.
      </p>
      <p>
        Al reunir el conjunto visual de ARCA, se reconstituyó el corpus temático de la pintura colonial americana entre
        1530 y 1830, para realizar un acercamiento a las circunstancias que permitieron la formación y consolidación de
        la cultura visual. Para el efecto, se analizó la producción de los distintos temas pictóricos —seculares y
        religiosos— en cada una de las regiones americanas, para establecer una «geografía del arte» y de esta manera
        observar las diferencias en su tratamiento en cada región.
      </p>
    </div>
    <div class="columna">
      <p>
        Con esta metodología se pretendía analizar la historia de la cultura gestual, lo cual revela los distintos
        sistemas de valores sobre el cuerpo en América colonial. La pregunta que se buscaba responder es: ¿de qué manera
        los temas visuales que elige una determinada cultura colonial manifiestan un conjunto de gestos que representan
        valores particulares a la sociedad que los produce?
      </p>
      <p>
        Para cumplir con los objetivos, fue necesario recurrir a la práctica convergente, y estructurar la base de datos
        teniendo en cuenta los presupuestos de la historia y las humanidades digitales, de tal manera que se comportara
        como un archivo interactivo. El diseño del portal fue resultado del proceso de investigación que cubrió el
        análisis de diversos referentes que contienen archivos visuales, además de la investigación sobre elementos
        históricos detrás de las imágenes.
      </p>
    </div>
  </div>

  <div class="cifras">
    <div v-for="cifra in cifras" :key="cifra.etiqueta" class="panelClaro cifra">
      <span class="etiquetaPanel">{{ cifra.etiqueta }}</span>
      <span class="valor">{{ cifra.valor }}</span>
      <span class="textoCifra">{{ cifra.texto }}</span>
    </div>
  </div>

  <p class="textoSuave">
    La investigación culminó en la elección de 11 grandes temas, lo cual demandó casi dos años de trabajo para ubicar la
    producción visual dentro de las categorías propias de su época, es decir, devolviéndolas a su lugar de producción,
    para evitar clasificarlas dentro de las expectativas y el canon de la modernidad. Esta clasificación, por sí misma,
    se convierte en metadatos complejos que ayudan a plantear nuevos problemas porque son datos procesados desde
    lecturas distantes.
  </p>

  <section class="separadorOscuro primeraVersion">
    <div class="encabezadoBloque">
      <div>
        <h2 class="tituloBloque">La primera versión sigue en línea</h2>
        <p class="nota">En este vínculo se puede acceder a la versión de ARCA que estuvo activa entre 2016 y 2022.</p>
      </div>
      <a href="https://arcav1.uniandes.edu.co/" class="botonContorno" target="_blank" rel="noopener">
        Visitar ARCA 2016–2022
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8" /></svg>
      </a>
    </div>
    <img v-if="imagen" :src="imagen.src" :alt="imagen.alt" class="captura" loading="lazy" />
    <!-- Vínculo visible debajo de la imagen, además del botón. -->
    <a class="vinculoVisible" href="https://arcav1.uniandes.edu.co/" target="_blank" rel="noopener"
      >https://arcav1.uniandes.edu.co/</a
    >
  </section>
</template>

<style lang="scss" scoped>
.panelColumnas {
  padding: clamp(24px, 3vw, 36px) clamp(22px, 3vw, 40px);
  display: flex;
  flex-direction: column;
  gap: 22px 48px;
}

.columna {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.cifras {
  margin: 28px 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 16px;
}

.cifra {
  border-radius: 14px;
  padding: 22px 24px;
  display: flex;
  flex-direction: column;
  gap: 6px;

  .valor {
    font-family: var(--fuenteSerif);
    font-size: 38px;
    line-height: 1.1;
  }

  .textoCifra {
    font-size: 14px;
    color: #8a6a45;
  }
}

.primeraVersion {
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.encabezadoBloque {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px 32px;

  .nota {
    margin-top: 6px;
    font-size: 16px;
  }
}

.vinculoVisible {
  align-self: flex-start;
  margin-top: -6px;
  font-size: 13.5px;

  &:link,
  &:visited {
    color: var(--oro);
    border-bottom: 1px solid #5a4a3e;
  }

  &:hover {
    color: var(--sobreOscuro);
  }
}

.captura {
  width: 100%;
  height: clamp(220px, 30vw, 420px);
  object-fit: cover;
  object-position: top center;
  border-radius: 14px;
  display: block;
}

@media (min-width: $minTablet) {
  .cifras {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: $minPantalla) {
  .panelColumnas {
    flex-direction: row;
    align-items: flex-start;
  }
}
</style>
