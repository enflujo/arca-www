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
import { definirDimsImagen, gql } from '~/utilidades/ayudas';

const cerebroGeneral = usarGeneral();

if (!cerebroGeneral.campos.length) {
  await useAsyncData('general', cerebroGeneral.cargarCampos);
}

/**
 * Operaciones en el servidor
 */
const ruta = useRoute();
const ObraGeneral = gql`
query {
  obras(filter: { registro: { _eq: ${ruta.params.registro} } }, limit: 1) {
    titulo,
    imagen { id title width height filename_download }
  }
}
`;

const { obras: datosGenerales } = await obtenerDatos(`obraGeneral${ruta.params.registro}`, ObraGeneral);

if (datosGenerales[0].imagen) {
  // Definir dims imagen
  datosGenerales[0].imagen.ancho = Math.round((datosGenerales[0].imagen.width / datosGenerales[0].imagen.height) * 300);
  datosGenerales[0].imagen.alto = 300;
}

useHead(elementosCabeza({ titulo: datosGenerales[0].titulo, banner: datosGenerales[0].imagen }, ruta.path));

// En el cliente
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

interface Respuesta {
  data: Ref<{ obras: RegistroObra[] }>;
  pending: Ref<boolean>;
}

const { data, pending }: Respuesta = obtenerDatosAsinc(`obra${ruta.params.registro}`, PeticionObra);

watch(data, ({ obras }) => {
  const _obra = obras[0];

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

  buscarRelacionadas(categorias[categorias.length - 1]);
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

  const { obras } = (await obtenerDatos(`relacionadas${ruta.params.registro}`, Relacionadas)) as { obras: Obra[] };

  if (obras) {
    relacionadas.value = obras.map(definirDimsImagen) as ObraGaleria[];
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

const tipoCampo = (llave: keyof RegistroObra) => {
  if (!tiposCampos[llave]) {
    return;
  }
  return tiposCampos[llave].tipo;
};

const rutaCampo = (llave: keyof RegistroObra) => {
  const { coleccion } = tiposCampos[llave];
  const datosPagina = cerebroGeneral.paginasArchivo.find((pagina) => pagina.coleccion === coleccion);

  if (datosPagina) {
    return datosPagina.slug;
  }
};
</script>

<template>
  <Cargador v-if="pending" />
  <div id="contenedorObra" v-else>
    <div id="contenedorImagen" :class="vistaCompleta ? 'grande' : ''">
      <div class="opciones">
        <IconoZoom class="controlImg zoom" :vistaCompleta="vistaCompleta" @click="cambiarVistaImagen" />
        <IconoLupa class="controlImg lupa" @click="cambiarVistaLupa" :class="verLupa ? 'activo' : ''" />

        <a
          class="controlImg"
          :href="`${apiBase}/assets/${datosGenerales[0].imagen.id}?download`"
          target="_blank"
          :download="datosGenerales[0].imagen.filename_download"
        >
          <IconoDescarga class="controlImg descarga" />
        </a>
      </div>
      <Lupa
        :datos="datosGenerales[0].imagen"
        :alt="datosGenerales[0].titulo"
        :activado="verLupa"
        @click="cambiarVistaImagen"
      />
    </div>

    <div v-if="obra" id="contenedorDatos">
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

      <template v-for="seccion in cerebroGeneral.campos" :key="`campo${seccion.campo}`">
        <template v-if="seccion.campo === 'separador'">
          <span class="separador"></span>
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
            :relacion="seccion.campo === 'categorias' ? null : `${seccion.campo}_id`"
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
  margin: 2em auto;
  width: 85vw;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  overflow: hidden;
}

#contenedorTituloAutor {
  max-width: 80%;
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
    width: 30px;
    margin-bottom: 1em;
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

#contenedorDatos {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 0 auto;
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
    line-height: 1;
    margin-bottom: 0.3em;
  }

  .autor {
    text-transform: uppercase;
    font-size: 0.9em;
    font-weight: bold;
    display: block;
  }
}

#registro {
  padding: 0.5em;
  font-family: var(--fuentePrincipal);
  border: 1px solid var(--profundidad);
  height: fit-content;
}

h2 {
  margin: 1em 0;
  border-bottom: 2px solid $rojoCerezo;
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
  margin-bottom: -2px;
  border-bottom: 4px solid $dolor;
}

.gestos > .subSeccion {
  border-right: 2px solid $rojoCerezo;
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
  border-top: 2px solid var(--rojoCerezo);
  padding: 0.8em 0;
  flex-wrap: wrap;
  align-content: flex-start;

  h3 {
    font-weight: bold;
    margin: 0 0.5em 0.5em 0;
    font-size: 1em;
  }

  &.medio {
    flex-basis: 48%;
  }

  // Dispositivos grandes y pantallas medianas
  @media (min-width: $minPantalla) {
    h3 {
      width: 130px;
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
  #contenedorImagen {
    flex-basis: 48%;

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
