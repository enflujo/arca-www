<script setup lang="ts">
import type { Point } from 'geojson';
import { usarGeneral } from '~/cerebros/general';
import { apiBase } from '~/config/general';
import type {
  CamposCategoria,
  CamposCategorias,
  NombresColecciones,
  Obra,
  ObraGaleria,
  RegistroObra,
  TiposCampos,
} from '~/tipos';
import type { BaseRegistro } from '~/tipos/bases';
import { definirDimsImagen, gql, peticion } from '~/utilidades/ayudas';
import { recortar, textoPlano, urlImagenPublica } from '~/utilidades/seo';
import { urlBase } from '~/config/general';
import { GRUPOS_COLECCION } from '~/utilidades/menu';

const cerebroGeneral = usarGeneral();

if (!cerebroGeneral.campos.length) {
  await cerebroGeneral.cargarCampos();
}

/**
 * Operaciones en el servidor
 */
const ruta = useRoute();

// El registro va dentro de la consulta: solo se aceptan números (evita errores 500 e inyecciones).
if (!/^\d+$/.test(String(ruta.params.registro))) {
  throw createError({ statusCode: 404, statusMessage: 'Obra no encontrada', fatal: true });
}

const ObraGeneral = gql`
query {
  obras(filter: { registro: { _eq: ${ruta.params.registro} } }, limit: 1) {
    titulo,
    imagen { id title width height filename_download }
  }
}
`;

const { obras: datosGenerales } = await obtenerDatos<BaseRegistro>(`obraGeneral${ruta.params.registro}`, ObraGeneral);

if (!datosGenerales || !datosGenerales.length) {
  throw createError({ statusCode: 404, statusMessage: 'Obra no encontrada', fatal: true });
}

if (datosGenerales[0]?.imagen) {
  // Definir dims imagen
  datosGenerales[0].imagen.ancho = Math.round((datosGenerales[0].imagen.width / datosGenerales[0].imagen.height) * 300);
  datosGenerales[0].imagen.alto = 300;
}

/** Imagen principal servida desde el dominio de ARCA, con nombre descriptivo (ver utilidades/seo.ts). */
const srcImagen = computed(() => {
  const imagen = datosGenerales[0]?.imagen;
  return imagen ? urlImagenPublica(imagen.id, datosGenerales[0]?.titulo ?? '') : undefined;
});

const obra: Ref<RegistroObra | null> = ref(null);
const relacionadas: Ref<ObraGaleria[] | null> = ref(null);
const ubicacionMapa: Ref<{ id: number; nombre: string; geometry: Point } | null> = ref(null);
const vistaCompleta = ref(false);
const verLupa = ref(true);

const PeticionObra = gql`
  query {
    obras(filter: { registro: { _eq: ${ruta.params.registro} } }, limit: 1) {
      registro
      fecha_inicial
      fecha_final
      sintesis
      comentario_bibliografico
      iconotexto
      fuente { descripcion }

      categoria1 { nombre slug }
      categoria2 { nombre slug }
      categoria3 { nombre slug }
      categoria4 { nombre slug }
      categoria5 { nombre slug }
      categoria6 { nombre slug }

      donante { slug nombre }
      relato_visual { slug nombre }
      fisiognomica { slug nombre }
      fisiognomica_imagen { slug nombre }
      cartela_filacteria { slug nombre }
      rostro { slug nombre }
      tipo_gestual { slug nombre }
      complejo_gestual { slug nombre }

      ciudad_origen { id nombre geo pais { slug nombre } }
      ubicacion { id nombre anotacion geo ciudad { id nombre pais { slug nombre } } }

      autores(sort: ["autores_id.apellido"]) { autores_id { id nombre apellido } }
      gesto1 {nombre slug}
      gesto2 {nombre slug}
      gesto3 {nombre slug}
      tecnicas(sort: ["tecnicas_id.slug"]) { tecnicas_id { slug nombre } }
      objetos(sort: ["objetos_id.slug"]) { objetos_id { slug nombre } }
      personajes(sort: ["personajes_id.slug"]) { personajes_id { slug nombre muerte} }
      simbolos(sort: ["simbolos_id.slug"]) { simbolos_id { slug nombre } }
      escenarios(sort: ["escenarios_id.slug"]) { escenarios_id { slug nombre } }
      descriptores(sort: ["descriptores_id.slug"]) { descriptores_id { slug nombre } }
      caracteristicas(sort: ["caracteristicas_id.slug"]) { caracteristicas_id { slug nombre } }
    }
  }
`;

// Se pide en el servidor para que toda la ficha (autor, fecha, lugar, síntesis…) venga en el HTML
// y la lean los buscadores. Antes se pedía solo en el navegador.
const datosObra = await obtenerDatos<{ obras: RegistroObra[] }>(`obra${ruta.params.registro}`, PeticionObra);
procesarObra(datosObra);

function procesarObra(res: { obras: RegistroObra[] } | null) {
  if (!res) return;
  const _obra = res.obras[0];

  if (!_obra) return;

  // Aplanar categorías en una sola lista/array
  const categorias = [];

  for (let i = 1; i <= 6; i++) {
    const coleccion = `categoria${i}` as CamposCategorias;
    const datosCategoria = _obra[coleccion] as CamposCategoria;

    if (datosCategoria) {
      datosCategoria.ruta = `/categorias${i}/${datosCategoria.slug}`;
      datosCategoria.campo = coleccion;
      categorias.push(datosCategoria);
    }
  }
  _obra.categorias = categorias;

  // Limpiar ciudad de origen
  if (_obra.ciudad_origen) {
    if (_obra.ubicacion && _obra.ubicacion.ciudad) {
      if (_obra.ciudad_origen.id === _obra.ubicacion.ciudad.id) {
        _obra.ciudad_origen = null;
      }
    }
  }

  // limpiar fechas
  const fechas = [_obra.fecha_inicial ? _obra.fecha_inicial : '?'];
  const hasta = _obra.fecha_final;

  if (hasta) {
    fechas.push(hasta);
  }

  _obra.fecha = fechas.join(' - ');

  // Aplanar Autores
  if (_obra.autores) {
    _obra.autores.forEach((autor) => {
      const partes = [];
      const { nombre, apellido } = autor.autores_id;
      if (nombre) partes.push(nombre);
      if (apellido) partes.push(apellido);

      autor.autores_id.nombreCompleto = partes.join(' ');
    });
  }

  // Aplanar lugares
  if (_obra.ciudad_origen) {
    const origenes = [{ url: `/ciudades/${_obra.ciudad_origen.id}`, nombre: _obra.ciudad_origen.nombre }];

    if (_obra.ciudad_origen.pais) {
      origenes.push({ url: `/paises/${_obra.ciudad_origen.pais.slug}`, nombre: _obra.ciudad_origen.pais.nombre });
    }

    _obra.ciudad_origen.procesado = origenes;
  }

  if (_obra.ubicacion) {
    const ubicaciones: { url: string; nombre: string; geo?: Point }[] = [
      {
        url: `/ubicaciones/${_obra.ubicacion.id}`,
        nombre: _obra.ubicacion.nombre + `${_obra.ubicacion.anotacion ? ' (' + _obra.ubicacion.anotacion + ')' : ''}`,
      },
    ];

    if (_obra.ubicacion.ciudad) {
      ubicaciones.push({ url: `/ciudades/${_obra.ubicacion.ciudad.id}`, nombre: _obra.ubicacion.ciudad.nombre });

      if (_obra.ubicacion.ciudad.pais) {
        ubicaciones.push({
          url: `/paises/${_obra.ubicacion.ciudad.pais.slug}`,
          nombre: _obra.ubicacion.ciudad.pais.nombre,
        });
      }
    }

    ubicacionMapa.value = { id: _obra.ubicacion.id, nombre: _obra.ubicacion.nombre, geometry: _obra.ubicacion.geo };

    _obra.ubicacion.procesado = ubicaciones;
  }

  obra.value = _obra;
}

// Las obras relacionadas se siguen cargando en el navegador.
onMounted(() => {
  const ultimaCategoria = obra.value?.categorias?.[obra.value.categorias.length - 1];
  if (!relacionadas.value && ultimaCategoria) buscarRelacionadas(ultimaCategoria);
});

/**
 * SEO de la ficha: título, descripción propia, imagen y datos estructurados (schema.org VisualArtwork).
 */
const autoresObra = computed(() => (obra.value?.autores ?? []).map((a) => a.autores_id.nombreCompleto).filter(Boolean));

const lugarObra = computed(() => {
  const o = obra.value;
  const lugares = o?.ciudad_origen?.procesado ?? o?.ubicacion?.procesado ?? [];
  return lugares.map((l) => l.nombre).join(', ');
});

const altImagen = computed(() => {
  const partes = [datosGenerales[0]?.titulo];
  if (autoresObra.value.length) partes.push(autoresObra.value.join(', '));
  if (obra.value?.fecha && obra.value.fecha !== '?') partes.push(obra.value.fecha);
  return partes.filter(Boolean).join(' · ');
});

const descripcionObra = computed(() => {
  const o = obra.value;
  const titulo = datosGenerales[0]?.titulo ?? '';
  const autoria = autoresObra.value.length ? `de ${autoresObra.value.join(', ')}` : '';
  const fecha = o?.fecha && o.fecha !== '?' ? `(${o.fecha})` : '';
  const lugar = lugarObra.value ? `— ${lugarObra.value}` : '';
  const inicio = [`${titulo},`, 'pintura colonial', autoria, fecha, lugar].filter(Boolean).join(' ');
  const sintesis = textoPlano(o?.sintesis);
  return recortar(sintesis ? `${inicio}. ${sintesis}` : `${inicio}. Ficha en ARCA, Arte Colonial Americano.`, 160);
});

const imagenSEO = datosGenerales[0]?.imagen;

// Los datos ya están completos aquí (se pidieron con await arriba), así que la cabecera se arma una sola vez.
// elementosCabeza usa la tienda de Pinia y debe llamarse durante el setup, no dentro de useHead.
const cabeza = elementosCabeza(
  { titulo: datosGenerales[0]?.titulo, banner: imagenSEO, descripcion: descripcionObra.value },
  ruta.path
);

useHead(() => {
  const urlImagenAbs = imagenSEO
    ? urlImagenPublica(imagenSEO.id, datosGenerales[0]?.titulo ?? '', 'obra', true)
    : undefined;
  const o = obra.value;

  const datosEstructurados: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'VisualArtwork',
    name: datosGenerales[0]?.titulo,
    url: `${urlBase}${ruta.path}`,
    identifier: String(ruta.params.registro),
    description: textoPlano(o?.sintesis) || descripcionObra.value,
    artform: 'Pintura',
    isPartOf: { '@type': 'Collection', name: 'ARCA · Arte Colonial Americano', url: urlBase },
  };

  if (urlImagenAbs) {
    datosEstructurados.image = {
      '@type': 'ImageObject',
      contentUrl: urlImagenAbs,
      caption: altImagen.value,
      creditText: textoPlano(o?.fuente?.descripcion) || undefined,
      acquireLicensePage: `${urlBase}/bibliografia-y-referencias`,
    };
  }
  // «Anónimo» no es una persona: no se declara como creador.
  const conNombre = autoresObra.value.filter((nombre) => !/^an[oó]nim[oa]s?$/i.test(nombre?.trim() ?? ''));
  if (conNombre.length) {
    datosEstructurados.creator = conNombre.map((nombre) => ({ '@type': 'Person', name: nombre }));
  }
  if (o?.fecha_inicial) {
    datosEstructurados.dateCreated = o.fecha_final ? `${o.fecha_inicial}/${o.fecha_final}` : String(o.fecha_inicial);
  }
  // El tipo declara `tecnicas` como objeto, pero el API devuelve una lista.
  const tecnicas = (Array.isArray(o?.tecnicas) ? o.tecnicas : []) as { tecnicas_id?: { nombre?: string } }[];
  if (tecnicas.length) {
    datosEstructurados.artMedium = tecnicas
      .map((t) => t.tecnicas_id?.nombre)
      .filter(Boolean)
      .join(', ');
  }
  // Solo la ciudad de origen es lugar de creación; la ubicación actual (museo, convento) va en la descripción.
  const origen = (o?.ciudad_origen?.procesado ?? []).map((l) => l.nombre).join(', ');
  if (origen) {
    datosEstructurados.locationCreated = { '@type': 'Place', name: origen };
  }

  return {
    ...cabeza,
    meta: [
      ...cabeza.meta.map((m) =>
        (m.property === 'og:image' || m.property === 'twitter:image') && urlImagenAbs
          ? { ...m, content: urlImagenAbs }
          : m
      ),
      { property: 'og:image:alt', content: altImagen.value },
    ],
    script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(datosEstructurados) }],
  };
});

async function buscarRelacionadas(ultimaCategoria: { campo: string; slug: string }) {
  const Relacionadas = gql`
    query {
      obras(filter: { _and : [
        {${ultimaCategoria.campo}: { slug:  {_eq: "${ultimaCategoria.slug}" } } },
        {registro: {_neq: "${ruta.params.registro}"}}
      ]}, limit: 20) { 
        registro
        titulo
        imagen {
          id,
          title
          width
          height
        }
        autores {
          autores_id {
            id
            nombre
            apellido
          }
        }
      }
    }
    `;

  const respuesta = await peticion<{ obras: Obra[] }>(Relacionadas);

  if (respuesta.obras) {
    relacionadas.value = respuesta.obras.map(definirDimsImagen) as ObraGaleria[];
  }
}

definePageMeta({ layout: 'default', keepalive: true });

function cambiarVistaImagen() {
  vistaCompleta.value = !vistaCompleta.value;
}
function cambiarVistaLupa() {
  verLupa.value = !verLupa.value;
}

const tiposCampos: { [coleccion: string]: { tipo: TiposCampos; coleccion: NombresColecciones | '' } } = {
  caracteristicas: { tipo: 'lista', coleccion: 'caracteristicas' },
  cartela_filacteria: { tipo: 'singular', coleccion: 'cartelas_filacterias' },
  categorias: { tipo: 'lista', coleccion: 'categorias1' },
  ciudad_origen: { tipo: 'lugar', coleccion: 'ciudades' },
  comentario_bibliografico: { tipo: 'parrafos', coleccion: '' },
  complejo_gestual: { tipo: 'singular', coleccion: 'complejos_gestuales' },
  descriptores: { tipo: 'lista', coleccion: 'descriptores' },
  donante: { tipo: 'singular', coleccion: 'donantes' },
  escenarios: { tipo: 'lista', coleccion: 'escenarios' },
  fecha: { tipo: 'singular', coleccion: '' },
  fisiognomica: { tipo: 'singular', coleccion: 'fisiognomicas' },
  fisiognomica_imagen: { tipo: 'singular', coleccion: 'fisiognomicas_imagen' },
  fuente: { tipo: 'parrafos', coleccion: '' },
  iconotexto: { tipo: 'parrafos', coleccion: '' },
  objetos: { tipo: 'lista', coleccion: 'objetos' },
  personajes: { tipo: 'lista', coleccion: 'personajes' },
  relato_visual: { tipo: 'singular', coleccion: 'relatos_visuales' },
  rostro: { tipo: 'singular', coleccion: 'rostros' },
  simbolos: { tipo: 'lista', coleccion: 'simbolos' },
  sintesis: { tipo: 'parrafos', coleccion: '' },
  tecnicas: { tipo: 'lista', coleccion: 'tecnicas' },
  tipo_gestual: { tipo: 'singular', coleccion: 'tipos_gestuales' },
  ubicacion: { tipo: 'lugar', coleccion: '' },
  gestos: { tipo: 'gestos', coleccion: '' },
};

/**
 * Campos de la ficha en tres grupos (datos básicos, de análisis y de gestos), igual que el menú lateral y
 * la visualización. Dentro de cada grupo se respeta el orden del CMS. Los campos que no están en ningún
 * grupo (síntesis, comentario, fuente…) van al final, sin título. Los separadores del CMS se omiten.
 */
const camposAgrupados = computed(() => {
  const campos = cerebroGeneral.campos.filter((c) => c.campo !== 'separador');
  const usados = new Set<string>();
  const lista: { campo: string; titulo: string }[] = [];

  GRUPOS_COLECCION.forEach((grupo) => {
    const delGrupo = campos.filter((c) => grupo.campos.includes(c.campo));
    if (!delGrupo.length) return;
    lista.push({ campo: '__grupo', titulo: grupo.titulo });
    delGrupo.forEach((c) => {
      usados.add(c.campo);
      lista.push(c);
    });
  });

  const resto = campos.filter((c) => !usados.has(c.campo));
  if (resto.length) lista.push({ campo: '__grupo', titulo: 'Descripción y fuente' }, ...resto);
  return lista as { campo: keyof RegistroObra & '__grupo'; titulo: string }[];
});

const tipoCampo = (llave: keyof RegistroObra) => {
  if (!tiposCampos[llave]) {
    return;
  }
  return tiposCampos[llave].tipo;
};

const rutaCampo = (llave: keyof RegistroObra) => {
  const campo = tiposCampos[llave];
  if (!campo) return;
  const { coleccion } = campo;
  const datosPagina = cerebroGeneral.paginasArchivo.find((pagina) => pagina.coleccion === coleccion);
  return datosPagina?.slug;
};
</script>

<template>
  <div id="contenedorObra">
    <!-- Columna de la imagen: la obra y, debajo, el mapa de su recorrido -->
    <div id="columnaImagen" :class="vistaCompleta ? 'grande' : ''">
      <div id="contenedorImagen" :class="vistaCompleta ? 'grande' : ''">
        <div class="opciones">
          <IconoZoom class="controlImg zoom" :vistaCompleta="vistaCompleta" @click="cambiarVistaImagen" />
          <IconoLupa class="controlImg lupa" @click="cambiarVistaLupa" :class="verLupa ? 'activo' : ''" />

          <a
            v-if="datosGenerales[0].imagen"
            class="controlImg"
            :href="`${apiBase}/assets/${datosGenerales[0].imagen.id}?download`"
            target="_blank"
            :download="datosGenerales[0].imagen.filename_download"
          >
            <IconoDescarga class="controlImg descarga" />
          </a>
        </div>
        <Lupa
          v-if="datosGenerales[0].imagen"
          :datos="datosGenerales[0].imagen"
          :src="srcImagen"
          :alt="altImagen"
          :activado="verLupa"
          @click="cambiarVistaImagen"
        />
      </div>

      <RegistroMapaObra
        v-if="obra && !vistaCompleta"
        class="mapaRecorrido"
        :origen="obra.ciudad_origen"
        :actual="obra.ubicacion"
      />
    </div>

    <div v-if="obra && datosGenerales && datosGenerales[0] && datosGenerales[0].imagen" id="contenedorDatos">
      <section id="contenedorPrimerBloque" class="seccion">
        <div id="contenedorTituloAutor">
          <h1>{{ datosGenerales[0].titulo }}</h1>

          <div v-if="obra.autores && obra.autores.length" id="autores">
            <NuxtLink
              v-for="autor in obra.autores"
              :key="`autor${autor.autores_id.id}`"
              :to="`/autores/${autor.autores_id.id}`"
              class="autor"
            >
              {{ autor.autores_id.nombreCompleto }}
            </NuxtLink>
          </div>
        </div>

        <div id="registro">{{ obra.registro }}</div>
      </section>

      <template v-for="(seccion, i) in camposAgrupados" :key="`campo-ficha-${seccion.campo}-${i}`">
        <template v-if="seccion.campo === '__grupo'">
          <h2 class="tituloGrupoFicha">{{ seccion.titulo }}</h2>
        </template>

        <template v-else-if="tipoCampo(seccion.campo) === 'lugar'">
          <RegistroLugares :datos="obra[seccion.campo]" :titulo="seccion.titulo" :punto="ubicacionMapa?.geometry" />
        </template>

        <template v-else-if="tipoCampo(seccion.campo) === 'singular'">
          <RegistroSingular
            class="medio"
            :titulo="seccion.titulo"
            :datos="obra[seccion.campo]"
            :ruta="rutaCampo(seccion.campo)"
          />
        </template>

        <template v-else-if="tipoCampo(seccion.campo) === 'lista'">
          <RegistroLista
            class="medio"
            :titulo="seccion.titulo"
            :datos="obra[seccion.campo]"
            :ruta="rutaCampo(seccion.campo)"
            :relacion="seccion.campo === 'categorias' ? undefined : `${seccion.campo}_id`"
            :jerarquia="seccion.campo === 'categorias'"
          />
        </template>

        <template v-else-if="tipoCampo(seccion.campo) === 'parrafos'">
          <RegistroParrafos :datos="obra[seccion.campo]" :titulo="seccion.titulo" />
        </template>

        <template v-else-if="seccion.campo === 'gestos'">
          <section v-if="obra.gesto1 || obra.gesto2 || obra.gesto3" class="seccion gestos">
            <h3>{{ seccion.titulo }}</h3>

            <div v-if="obra.gesto1" class="subSeccion">
              <h4>Personaje principal</h4>
              <NuxtLink :to="`/gestos/${obra.gesto1.slug}`" class="contenido singular">
                {{ obra.gesto1.nombre }}
              </NuxtLink>
            </div>

            <div v-if="obra.gesto2" class="subSeccion">
              <h4>Personaje secundario</h4>
              <NuxtLink :to="`/gestos/${obra.gesto2.slug}`" class="contenido singular">
                {{ obra.gesto2.nombre }}
              </NuxtLink>
            </div>

            <div v-if="obra.gesto3" class="subSeccion">
              <h4>Otros personajes</h4>
              <NuxtLink :to="`/gestos/${obra.gesto3.slug}`" class="contenido singular">
                {{ obra.gesto3.nombre }}
              </NuxtLink>
            </div>
          </section>
        </template>
      </template>
    </div>

    <section id="contenedorGaleria" class="completo">
      <h2>Obras Relacionadas</h2>
      <GaleriaMosaico v-if="relacionadas" :obras="relacionadas" :pagina="1" />
    </section>
  </div>
</template>

<style lang="scss" scoped>
#contenedorObra {
  display: flex;
  margin: 1.5em auto;
  width: 85vw;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  overflow: hidden;
}

#contenedorTituloAutor {
  max-width: 80%;
}

#columnaImagen {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;

  &.grande {
    flex-basis: 100%;
  }

  gap: 16px;

  // El mapa se alinea con la imagen (a la derecha de los botones de zoom, lupa y descarga).
  .mapaRecorrido {
    margin-left: calc(30px + 0.5em);
  }
}

#contenedorImagen {
  display: flex;
  justify-content: center;
  align-items: flex-start;

  &.grande {
    flex-basis: 100%;

    .contenedorLupa {
      width: 100%;
    }
  }

  .opciones {
    display: flex;
    flex-direction: column;
    margin-right: 0.5em;
  }
  .controlImg {
    width: 24px;
    margin-bottom: 0.9em;
    cursor: pointer;

    &:hover {
      opacity: 0.6;
    }
  }

  .zoom {
    display: none;
  }

  .lupa {
    fill: rgb(204, 204, 204);
    &.activo {
      fill: black;
    }
  }
}

// Ficha compacta: letra base de 14 px y poco espacio entre campos.
#contenedorDatos {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 0 auto;
  font-size: 13px;
  line-height: 1.4;
}

.tituloGrupoFicha {
  flex-basis: 100%;
  margin: 18px 0 2px;
  padding: 0 0 4px;
  border-bottom: 2px solid var(--ocre);
  font-family: var(--fuenteSerif);
  font-size: 19px;
  font-weight: 400;
  color: var(--ocre);
}

#contenedorPrimerBloque {
  display: flex;
  justify-content: space-between;
  border: none;
}

#contenedorTituloAutor {
  margin-right: 1em;

  h1 {
    margin-bottom: 0;
    font-size: clamp(21px, 1.8vw, 25px);
    line-height: 1.1;
    margin-bottom: 0.25em;
  }

  .autor {
    text-transform: uppercase;
    font-size: 0.85em;
    font-weight: bold;
    display: block;
  }
}

#registro {
  padding: 0.35em 0.9em;
  font-family: var(--fuenteSerif);
  font-size: 1.1em;
  color: var(--ocre);
  background-color: var(--papel);
  border: 1px solid var(--borde);
  border-radius: 999px;
  height: fit-content;
}

h2 {
  margin: 1em 0;
  border-bottom: 1px solid var(--bordeFuerte);
  padding-bottom: 0.3em;
}

.seccion.gestos {
  flex-wrap: nowrap;
  .subSeccion {
    flex-basis: 25%;
  }
}

.separador {
  display: block;
  width: 100%;
  height: 0;
  margin-bottom: -1px;
  border-bottom: 2px solid var(--ocre);
}

.gestos > .subSeccion {
  border-right: 1px solid var(--borde);
  padding-right: 1em;
  padding-left: 0;

  & ~ .subSeccion {
    padding-left: 1em;
  }
}

.subSeccion {
  h4 {
    font-style: italic;
  }

  &:last-child {
    border: none;
  }
}

/**
  Estilos para componentes internos "hijos" de este.
  Ver documentación de :deep() en:
  https://vuejs.org/api/sfc-css-features.html#deep-selectors
*/

:deep(.seccion) {
  display: flex;
  flex-basis: 100%;
  border-top: 1px solid var(--borde);
  padding: 7px 0;
  flex-wrap: wrap;
  align-content: flex-start;

  p {
    margin: 0;
  }

  // Etiquetas de campo: Manrope pequeña en mayúsculas, como en el rediseño.
  h3 {
    margin: 0.25em 0.5em 0.25em 0;
    font-family: var(--fuenteSans);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.12em;
    line-height: 1.4;
    text-transform: uppercase;
    color: var(--textoSuave);
  }

  &.medio {
    flex-basis: 48%;
  }

  // Dispositivos grandes y pantallas medianas
  @media (min-width: $minPantalla) {
    h3 {
      width: 110px;
    }

    .contenido {
      flex: 1;
    }
  }
}

.completo {
  flex-basis: 95%;
  margin: 0 auto;
}

// Dispositivos grandes y pantallas medianas
@media (min-width: $minPantalla) {
  #contenedorObra {
    width: 95vw;
  }
}

// Pantallas grandes
@media (min-width: $minPantallaGrande) {
  #columnaImagen {
    width: auto;
    flex-basis: 46%;
  }

  #contenedorImagen {
    .zoom {
      display: block;
    }

    .contenedorLupa {
      width: 70%;
    }
  }

  #contenedorDatos {
    flex-basis: 50%;
  }
}

//Pantallas gigantes
@media (min-width: $minPantallaGigante) {
}
</style>
