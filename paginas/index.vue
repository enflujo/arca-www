<script setup lang="ts">
import { usarGeneral } from '~/cerebros/general';
import { gql } from '~/utilidades/ayudas';
import { urlImagenPublica } from '~/utilidades/seo';

// Inicio · rediseño 2026 (diseño «Inicio · escritorio», variante Café).

const general = usarGeneral();

useHead(elementosCabeza({}, '/'));

/** Obra del hero: «Diluvio» de Cristóbal de Villalpando (registro 595). */
const REGISTRO_PORTADA = 595;

interface Esquema {
  obras_aggregated: { count: { registro: number } }[];
  obras: {
    registro: number;
    titulo: string;
    imagen?: { id: string };
    autores: { autores_id: { nombre?: string; apellido?: string } }[];
  }[];
  paginas: { secciones?: { titulo?: string | null; texto?: string | null }[] }[];
}

const Inicio = gql`
  query {
    obras_aggregated { count { registro } }
    obras(filter: { registro: { _eq: ${REGISTRO_PORTADA} } }, limit: 1) {
      registro
      titulo
      imagen { id }
      autores { autores_id { nombre apellido } }
    }
    paginas(filter: { slug: { _eq: "sobre-arca" } }, limit: 1) { secciones }
  }
`;

// Se pide en el servidor: el contenido del inicio queda en el HTML (SEO).
const datos = await obtenerDatos<Esquema>('inicio', Inicio);

const totalObras = new Intl.NumberFormat('es-CO').format(datos.obras_aggregated?.[0]?.count?.registro ?? 27000);

const portada = datos.obras?.[0];
const autorPortada = (portada?.autores ?? [])
  .map((a) => [a.autores_id.nombre, a.autores_id.apellido].filter(Boolean).join(' '))
  .join(', ');
const imagenPortada = portada?.imagen?.id ? urlImagenPublica(portada.imagen.id, portada.titulo) : null;

// Textos del CMS (página «Sobre ARCA») que se mostraban en el inicio anterior. Se omite la indicación
// «Inicie el recorrido en el menú superior», que ya no aplica.
const seccionesCMS = (datos.paginas?.[0]?.secciones ?? [])
  .filter((s) => s.titulo && s.texto && !/inicie el recorrido/i.test(s.texto))
  // Sin los párrafos vacíos (<p>&nbsp;</p>) que el editor del CMS deja como separadores.
  .map((s) => ({
    ...s,
    texto: (s.texto ?? '')
      .replace(/<p>(\s|&nbsp;| )*<\/p>/gi, '')
      // El CMS dice «veinticinco mil pinturas»; la colección tiene hoy la cifra del API (27.000).
      .replace(/veinticinco mil/gi, totalObras),
  }));

const camposColeccion = computed(() => general.paginasArchivo.filter((p) => p.mostrar_en_menu).length || 21);

const grupos = [
  {
    titulo: 'La colección',
    muestra: [
      { nombre: 'Técnicas', ruta: '/tecnicas' },
      { nombre: 'Países', ruta: '/paises' },
    ],
    mas: 5,
  },
  {
    titulo: 'Iconografía',
    muestra: [
      { nombre: 'Símbolos', ruta: '/simbolos' },
      { nombre: 'Objetos', ruta: '/objetos' },
    ],
    mas: 5,
  },
  {
    titulo: 'Gesto y cuerpo',
    muestra: [
      { nombre: 'Rostros', ruta: '/rostros' },
      { nombre: 'Complejos gestuales', ruta: '/complejos-gestuales' },
    ],
    mas: 5,
  },
];

const hitos = [
  {
    anio: '2012',
    titulo: 'Los discursos del cuerpo',
    texto:
      'La investigación sobre la narrativa del cuerpo en la pintura neogranadina da origen a la pregunta del proyecto.',
  },
  {
    anio: '2015',
    titulo: 'La escala americana',
    texto: 'La búsqueda se amplía a toda la pintura colonial americana, con acervos de siete países.',
  },
  {
    anio: '2016–2022',
    titulo: 'Primera versión del portal',
    texto:
      'ARCA se publica como base de datos relacional con herramientas de análisis y una geografía de los temas pictóricos.',
  },
  {
    anio: '2019',
    titulo: 'Los ingenios del pincel',
    texto: 'E-book sobre geografía de la pintura y cultura visual en América colonial.',
  },
  {
    anio: 'Hoy',
    titulo: 'Visualización y análisis',
    texto: `${totalObras} pinturas y cerca de 800 mil etiquetas, abiertas a nuevas lecturas desde los datos.`,
    hoy: true,
  },
];
</script>

<template>
  <div id="inicio">
    <!-- HERO · imagen de borde a borde -->
    <section class="hero">
      <img
        v-if="imagenPortada"
        class="heroImagen"
        :src="imagenPortada"
        :alt="`${portada?.titulo}${autorPortada ? `, ${autorPortada}` : ''}: escena del diluvio con el arca bajo la tormenta`"
        fetchpriority="high"
      />
      <div class="velo velo1" aria-hidden="true"></div>
      <div class="velo velo2" aria-hidden="true"></div>

      <div class="heroContenido">
        <p class="sobretitulo">Universidad de los Andes · Humanidades digitales</p>

        <div class="heroTexto">
          <p class="heroLema">Arte Colonial Americano</p>
          <h1 class="heroTitulo">ARCA</h1>
          <p class="heroEntrada">
            Esta nueva versión de ARCA es una base de datos relacional e interactiva. Permite navegar por las distintas
            colecciones, desde cualquier lugar, para hacer lecturas personales de temas.
          </p>
        </div>

        <div class="heroPie">
          <dl class="cifras">
            <div class="cifra">
              <dt class="valor">{{ totalObras }}</dt>
              <dd>pinturas analizadas</dd>
            </div>
            <div class="cifra">
              <dt class="valor">800 mil</dt>
              <dd>etiquetas descriptivas</dd>
            </div>
            <div class="cifra">
              <dt class="valor">1530–1830</dt>
              <dd>periodo de la colección</dd>
            </div>
            <div class="cifra">
              <dt class="valor">3 Américas</dt>
              <dd>hispana, lusa y anglo</dd>
            </div>
          </dl>

          <NuxtLink v-if="portada" class="creditoImagen" :to="`/obras/${portada.registro}`">
            <span class="creditoTitulo">{{ portada.titulo }}</span>
            <span>
              {{ autorPortada }} · <span class="creditoNumero">Nº {{ portada.registro }}</span>
            </span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- SOBRE ESTA VERSIÓN -->
    <section class="bloque sobreVersion">
      <h2 class="tituloSeccion">Sobre esta versión</h2>
      <!-- Los textos de «Sobre ARCA» (nueva versión, metadatos, georreferencia…) están completos en /sobre-arca. -->
      <div class="panel panelSobre">
        <div v-for="(seccion, i) in seccionesCMS" :key="`seccion-cms-${i}`" class="seccionCMS">
          <h3>{{ seccion.titulo }}</h3>
          <div class="textoCMS" v-html="seccion.texto"></div>
        </div>
      </div>
    </section>

    <!-- NIVEL 1 · dos entradas principales -->
    <section class="bloque entradas">
      <div class="encabezadoSeccion conLinea">
        <h2 class="tituloSeccion">Dos maneras de entrar a ARCA</h2>
        <p class="nota">Mirar obra por obra, o leer el conjunto.</p>
      </div>

      <div class="tarjetas">
        <article id="coleccion" class="panel tarjetaEntrada">
          <div class="numeracion">
            <span class="numero">01</span>
            <span class="linea" aria-hidden="true"></span>
            <span class="etiqueta">{{ camposColeccion }} campos de clasificación</span>
          </div>
          <div class="textoEntrada">
            <h3>Colección</h3>
            <p>
              Recorre las pinturas a través de los campos con los que fueron descritas: temas, autores, lugares,
              iconografía y lenguaje del cuerpo.
            </p>
          </div>
          <div class="grupos">
            <div v-for="grupo in grupos" :key="grupo.titulo" class="grupo">
              <div class="grupoTitulo">{{ grupo.titulo }}</div>
              <div class="chips">
                <NuxtLink v-for="campo in grupo.muestra" :key="campo.ruta" :to="campo.ruta" class="chip">
                  {{ campo.nombre }}
                </NuxtLink>
                <NuxtLink to="/categorias" class="chip mas">+{{ grupo.mas }} campos</NuxtLink>
              </div>
            </div>
          </div>
          <NuxtLink to="/categorias" class="boton">
            Entrar a la Colección de ARCA
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </NuxtLink>
        </article>

        <article id="en-vivo" class="panel tarjetaEntrada">
          <div class="numeracion">
            <span class="numero">02</span>
            <span class="linea" aria-hidden="true"></span>
            <span class="etiqueta">Conectado a la base de datos</span>
          </div>
          <div class="textoEntrada">
            <h3>Visualización y análisis</h3>
            <p>
              Filtra por país y periodo, y lee la colección como conjunto: su escala, su cronología y el desplazamiento
              geográfico de las obras.
            </p>
          </div>
          <ul class="vistas">
            <li>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h4l3-8 4 16 3-8h4" /></svg>
              Pulso de la colección
            </li>
            <li>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="10" r="3" />
                <path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z" />
              </svg>
              Geografía de las obras
            </li>
            <li>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></svg>
              Producción por década
            </li>
          </ul>
          <a href="/visualizacion-y-analisis" class="boton">
            Abrir Visualización y análisis
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </a>
        </article>
      </div>
    </section>

    <!-- NIVEL 2 · recursos -->
    <section id="recursos" class="bloque recursos">
      <div class="encabezadoSeccion">
        <h2 class="tituloSeccion pequeno">Recursos</h2>
        <p class="nota">Para investigar, citar y construir con ARCA.</p>
      </div>
      <div class="tarjetasRecursos">
        <NuxtLink to="/productos-relacionados" class="panel recurso">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2V5z" />
            <path d="M4 19a2 2 0 012-2h13" />
          </svg>
          <span class="recursoTitulo">Productos relacionados</span>
          <span class="recursoTexto">
            El libro <i>Los ingenios del pincel. Geografía de la pintura y cultura visual en América colonial</i> y
            otros productos del proyecto.
          </span>
        </NuxtLink>
        <NuxtLink to="/bibliografia-y-referencias" class="panel recurso">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M3 16l5-5 4 4 3-3 6 6" />
          </svg>
          <span class="recursoTitulo">Uso de imágenes y bibliografía</span>
          <span class="recursoTexto">
            Cómo citar y reutilizar las imágenes, y las fuentes de referencia del proyecto.
          </span>
        </NuxtLink>
        <NuxtLink to="/open-source" class="panel recurso">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" /></svg>
          <span class="recursoTitulo">Open Source</span>
          <span class="recursoTexto">Datos, código y documentación de la API para trabajar con la colección.</span>
        </NuxtLink>
      </div>
    </section>

    <!-- SOBRE ARCA · historia -->
    <section id="historia" class="bloque historia">
      <div class="historiaIntro">
        <p class="sobretitulo oscuro">Sobre ARCA · Historia</p>
        <h2>De una pregunta sobre el cuerpo a un archivo continental</h2>
        <p class="nota">
          La explicación completa del proyecto y el archivo de la versión 2016–2022 están en Sobre ARCA.
        </p>
        <NuxtLink to="/sobre-arca" class="botonContorno">
          Ir a Sobre ARCA
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </NuxtLink>
      </div>

      <ol class="hitos">
        <li v-for="hito in hitos" :key="hito.anio" class="hito">
          <div class="anio" :class="{ hoy: hito.hoy }">{{ hito.anio }}</div>
          <div>
            <div class="hitoTitulo">{{ hito.titulo }}</div>
            <div class="hitoTexto">{{ hito.texto }}</div>
          </div>
        </li>
      </ol>
    </section>
  </div>
</template>

<style lang="scss" scoped>
// Variante «Café» del diseño: fondo oscuro, paneles claros.
#inicio {
  --fondo: var(--tinta);
  --texto: var(--sobreOscuro);
  --suave: #d8c9b2;
  --tenue: var(--sobreOscuroSuave);
  --linea: #3a2e27;
  --lineaFuerte: #5a4a3e;
  --panelTexto: var(--tinta);
  --panelTenue: #2b2018;
  --panelLinea: #e0d3b8;
  --chipLinea: #d6c3a0;
  --margen: clamp(20px, 4vw, 56px);

  background-color: var(--fondo);
  color: var(--texto);
}

/* ---------- Hero ---------- */
.hero {
  position: relative;
  // El encabezado del sitio queda sobre la imagen, como en el diseño.
  margin-top: calc(-1 * #{$altoEncabezado});
  min-height: min(920px, 100svh);
  display: flex;
  overflow: hidden;
  background-color: var(--fondo);
}

.heroImagen {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 60% center;
}

.velo {
  position: absolute;
  inset: 0;
}

.velo1 {
  background: linear-gradient(
    90deg,
    rgba(20, 15, 12, 0.95) 0%,
    rgba(20, 15, 12, 0.84) 32%,
    rgba(20, 15, 12, 0.32) 62%,
    rgba(20, 15, 12, 0.02) 100%
  );
}

.velo2 {
  background: linear-gradient(
    180deg,
    rgba(20, 15, 12, 0.7) 0%,
    rgba(20, 15, 12, 0) 16%,
    rgba(20, 15, 12, 0) 58%,
    rgba(20, 15, 12, 1) 100%
  );
}

.heroContenido {
  position: relative;
  flex: 1;
  box-sizing: border-box;
  padding: calc(#{$altoEncabezado} + 2.5em) var(--margen) var(--margen);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 40px;
}

.sobretitulo {
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--oro);

  &.oscuro {
    color: var(--oro);
  }
}

.heroTexto {
  max-width: 820px;
  display: flex;
  flex-direction: column;
  gap: 26px;
}

.heroLema {
  margin: 0;
  font-family: var(--fuenteSerif);
  font-style: italic;
  font-size: clamp(24px, 3vw, 38px);
  line-height: 0.93;
  color: var(--oro);
}

.heroTitulo {
  margin: 0;
  font-family: var(--fuenteSerif);
  font-weight: 400;
  font-size: clamp(52px, 6.5vw, 84px);
  line-height: 0.93;
  color: var(--texto);
}

.heroEntrada {
  margin: 0;
  max-width: 700px;
  font-family: var(--fuenteSerif);
  font-size: clamp(16px, 1.4vw, 20px);
  line-height: 1.5;
  color: var(--texto);
}

.heroPie {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 32px 40px;
}

.cifras {
  margin: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  border-top: 1px solid rgba(243, 233, 216, 0.22);
  width: 100%;
  max-width: 960px;
}

.cifra {
  padding: 22px 20px 0 0;
  display: flex;
  flex-direction: column;
  gap: 4px;

  .valor {
    font-family: var(--fuenteSerif);
    font-size: clamp(26px, 2.4vw, 34px);
    line-height: 1.05;
    color: var(--texto);
  }

  dd {
    margin: 0;
    font-size: 14px;
    color: var(--suave);
  }
}

.creditoImagen {
  max-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: right;
  font-size: 13px;
  padding-bottom: 4px;

  &:link,
  &:visited {
    color: var(--suave);
  }

  &:hover .creditoTitulo {
    color: var(--oro);
  }
}

.creditoTitulo {
  font-family: var(--fuenteSerif);
  font-style: italic;
  font-size: 18px;
  color: var(--texto);
  transition: color 0.2s ease;
}

.creditoNumero {
  color: var(--oro);
  font-weight: 700;
}

/* ---------- Secciones ---------- */
.bloque {
  box-sizing: border-box;
  padding: 64px var(--margen) 0;
  max-width: 1600px;
  margin: 0 auto;
}

.tituloSeccion {
  margin: 0;
  font-family: var(--fuenteSerif);
  font-weight: 400;
  font-size: clamp(26px, 2.4vw, 34px);
  color: var(--oro);

  &.pequeno {
    font-size: clamp(22px, 2vw, 28px);
  }
}

.nota {
  margin: 0;
  font-size: 14px;
  color: var(--tenue);
}

.panel {
  background-color: var(--papel);
  color: var(--panelTexto);
  border: 1px solid var(--panelLinea);
  border-radius: 20px;
  box-sizing: border-box;
}

/* Sobre esta versión */
.sobreVersion {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.panelSobre {
  padding: clamp(28px, 4vw, 48px) clamp(24px, 4vw, 56px);
  display: flex;
  flex-direction: column;
  gap: 32px;

  p {
    margin: 0;
    font-size: 14px;
    line-height: 1.65;
    color: var(--textoCuerpo);
  }

  .entrada {
    font-family: var(--fuenteSerif);
    font-size: clamp(19px, 1.6vw, 23px);
    line-height: 1.55;
    color: var(--tinta);
  }
}

.columnas {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.columna {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.divisor {
  height: 1px;
  background-color: var(--panelLinea);
}

.seccionCMS {
  border-top: 1px solid var(--panelLinea);
  padding-top: 28px;

  &:first-child {
    border-top: 0;
    padding-top: 0;
  }

  h3 {
    margin: 0 0 14px;
    font-family: var(--fuenteSerif);
    font-size: 24px;
    color: var(--ocre);
  }

  .textoCMS :deep(p) {
    margin: 0 0 1em;
    font-size: 14px;
    line-height: 1.7;
    color: var(--textoCuerpo);
  }

  .textoCMS :deep(p:empty),
  .textoCMS :deep(p:last-child) {
    margin-bottom: 0;
  }
}

/* Dos maneras de entrar */
.entradas {
  padding-top: 40px;
  padding-bottom: 96px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.encabezadoSeccion {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px 20px;

  &.conLinea {
    border-top: 1px solid var(--linea);
    padding-top: 40px;
  }
}

.tarjetas {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 24px;
}

.tarjetaEntrada {
  border-color: var(--papel);
  padding: clamp(26px, 3vw, 40px);
  display: flex;
  flex-direction: column;
  gap: 26px;
  min-height: 440px;
}

.numeracion {
  display: flex;
  align-items: center;
  gap: 16px;

  .numero {
    font-family: var(--fuenteSerif);
    font-style: italic;
    font-size: 34px;
    color: var(--ocre);
  }

  .linea {
    height: 1px;
    flex-grow: 1;
    background-color: var(--panelLinea);
  }

  .etiqueta {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--panelTenue);
    text-align: right;
  }
}

.textoEntrada {
  display: flex;
  flex-direction: column;
  gap: 12px;

  h3 {
    margin: 0;
    font-family: var(--fuenteSerif);
    font-weight: 400;
    font-size: clamp(32px, 2.9vw, 42px);
    line-height: 1;
    color: var(--tinta);
  }

  p {
    margin: 0;
    font-size: 14px;
    line-height: 1.6;
    color: var(--panelTenue);
  }
}

.grupos {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.grupo {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
}

.grupoTitulo {
  width: 118px;
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ocre);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chip {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  padding: 0 12px;
  border: 1px solid var(--chipLinea);
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;

  &:link,
  &:visited {
    color: var(--tinta);
  }

  &:hover {
    border-color: var(--ocre);
    color: var(--ocre);
  }

  &.mas {
    border-color: transparent;
    background-color: var(--arena);
    font-weight: 600;

    &:link,
    &:visited {
      color: var(--panelTenue);
    }
  }
}

.vistas {
  margin: 0;
  border: 1px solid var(--chipLinea);
  border-radius: 14px;
  padding: 14px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  li {
    display: flex;
    align-items: center;
    gap: 14px;
    font-family: var(--fuenteSerif);
    font-size: 20px;
    color: var(--panelTenue);
  }

  svg {
    width: 22px;
    height: 22px;
    flex-shrink: 0;
    fill: none;
    stroke: var(--ocre);
    stroke-width: 1.6;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}

.boton {
  margin-top: auto;
  align-self: flex-start;
  box-sizing: border-box;
  min-height: 52px;
  padding: 0 26px;
  border-radius: 10px;
  background-color: var(--ocre);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 700;
  transition: background-color 0.2s ease;

  &:link,
  &:visited {
    color: var(--papel);
  }

  &:hover {
    background-color: var(--ocreOscuro);
    color: var(--papel);
  }

  svg {
    width: 16px;
    height: 16px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}

/* Recursos */
.recursos {
  max-width: none;
  padding: 56px var(--margen);
  background-color: #221a16;
  border-top: 1px solid var(--linea);
  border-bottom: 1px solid var(--linea);
  display: flex;
  flex-direction: column;
  gap: 28px;

  .encabezadoSeccion {
    justify-content: flex-start;
  }
}

.tarjetasRecursos {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 20px;
}

.recurso {
  border-radius: 14px;
  padding: 26px 28px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition:
    border-color 0.2s ease,
    transform 0.2s ease;

  &:link,
  &:visited {
    color: var(--tinta);
  }

  &:hover {
    border-color: var(--ocre);
    transform: translateY(-2px);
  }

  svg {
    width: 24px;
    height: 24px;
    fill: none;
    stroke: var(--ocre);
    stroke-width: 1.6;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}

.recursoTitulo {
  font-family: var(--fuenteSerif);
  font-size: 24px;
  color: var(--tinta);
}

.recursoTexto {
  font-size: 14.5px;
  line-height: 1.55;
  color: var(--panelTenue);
}

/* Historia */
.historia {
  padding-top: 88px;
  padding-bottom: 88px;
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.historiaIntro {
  display: flex;
  flex-direction: column;
  gap: 18px;

  h2 {
    margin: 0;
    font-family: var(--fuenteSerif);
    font-weight: 400;
    font-size: clamp(28px, 2.6vw, 38px);
    line-height: 1.05;
    color: var(--texto);
  }

  .nota {
    font-size: 14px;
    line-height: 1.6;
    color: var(--suave);
  }
}

.botonContorno {
  align-self: flex-start;
  margin-top: 8px;
  min-height: 48px;
  padding: 0 22px;
  border: 1px solid var(--lineaFuerte);
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 600;

  &:link,
  &:visited {
    color: var(--texto);
  }

  &:hover {
    border-color: var(--oro);
    color: var(--oro);
  }

  svg {
    width: 16px;
    height: 16px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}

.hitos {
  margin: 0;
  padding: 0;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.hito {
  display: flex;
  flex-direction: column;
  gap: 6px 32px;
  padding: 22px 0;
  border-top: 1px solid var(--linea);
}

.anio {
  width: 150px;
  flex-shrink: 0;
  font-family: var(--fuenteSerif);
  font-size: 30px;
  color: var(--texto);

  &.hoy {
    color: var(--oro);
  }
}

.hitoTitulo {
  font-family: var(--fuenteSerif);
  font-size: 23px;
  margin-bottom: 6px;
}

.hitoTexto {
  font-size: 14px;
  line-height: 1.55;
  color: var(--tenue);
}

/* ---------- Tableta ---------- */
@media (min-width: $minTablet) {
  .cifras {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .cifra + .cifra {
    padding-left: 20px;
    border-left: 1px solid rgba(243, 233, 216, 0.22);
  }

  .tarjetasRecursos {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .hito {
    flex-direction: row;
  }
}

// En celular las cifras van en 2×2; la línea divisoria solo entre columnas.
@media (max-width: #{$minTablet - 1px}) {
  .cifra:nth-child(even) {
    padding-left: 20px;
    border-left: 1px solid rgba(243, 233, 216, 0.22);
  }

  .creditoImagen {
    text-align: left;
  }

  .heroImagen {
    object-position: 68% center;
  }
}

/* ---------- Escritorio ---------- */
@media (min-width: $minPantalla) {
  .columnas {
    flex-direction: row;
    gap: 56px;
  }

  .divisor {
    width: 1px;
    height: auto;
    align-self: stretch;
  }

  .tarjetas {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .historia {
    flex-direction: row;
    gap: 72px;
  }

  .historiaIntro {
    width: 380px;
    flex-shrink: 0;
  }
}
</style>
