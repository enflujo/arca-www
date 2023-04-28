<script setup>
import { apiBase } from '~/config/general';
import { definirDimsImagen, gql, urlImagen } from '~~/utilidades/ayudas';

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
const obra = ref(null);
const relacionadas = ref(null);
const ubicacionMapa = ref(null);
const vistaCompleta = ref(false);
const verLupa = ref(true);

const Obra = gql`
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

      ciudad_origen { id nombre pais { slug nombre } }
      ubicacion { id nombre anotacion geo ciudad { id nombre pais { slug nombre } } }

      autores(sort: ["autores_id.apellido"]) { autores_id { id nombre apellido } }
      gesto1 {nombre slug}
      # gestos(sort: ["gestos_id.slug"]) { gestos_id { codigo slug nombre } }
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

const { data, pending } = obtenerDatosAsinc(`obra${ruta.params.registro}`, Obra);

watch(data, ({ obras }) => {
  const _obra = obras[0];

  // Aplanar categorías en una sola lista/array
  _obra.categorias = [];

  for (let i = 1; i <= 6; i++) {
    const coleccion = `categoria${i}`;
    if (_obra[coleccion]) {
      _obra[coleccion].ruta = `/categorias${i}/${_obra[coleccion].slug}`;
      _obra[coleccion].coleccion = coleccion;
      _obra.categorias.push(_obra[coleccion]);
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

  _obra.fechas = fechas;

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
    const origen = [{ url: `/ciudades/${_obra.ciudad_origen.id}`, nombre: _obra.ciudad_origen.nombre }];

    if (_obra.ciudad_origen.pais) {
      origen.push({ url: `/paises/${_obra.ciudad_origen.pais.slug}`, nombre: _obra.ciudad_origen.pais.nombre });
    }

    _obra.ciudad_origen = origen;
  }

  if (_obra.ubicacion) {
    const ubicacion = [
      {
        url: `/ubicaciones/${_obra.ubicacion.id}`,
        nombre: _obra.ubicacion.nombre + `${_obra.ubicacion.anotacion ? ' (' + _obra.ubicacion.anotacion + ')' : ''}`,
        geo: _obra.ubicacion.geo,
      },
    ];

    if (_obra.ubicacion.ciudad) {
      ubicacion.push({ url: `/ciudades/${_obra.ubicacion.ciudad.id}`, nombre: _obra.ubicacion.ciudad.nombre });

      if (_obra.ubicacion.ciudad.pais) {
        ubicacion.push({
          url: `/paises/${_obra.ubicacion.ciudad.pais.slug}`,
          nombre: _obra.ubicacion.ciudad.pais.nombre,
        });
      }
    }

    ubicacionMapa.value = { id: _obra.ubicacion.id, nombre: _obra.ubicacion.nombre, geometry: _obra.ubicacion.geo };

    _obra.ubicacion = ubicacion;
  }

  obra.value = _obra;

  buscarRelacionadas(_obra.categorias[_obra.categorias.length - 1].coleccion);
});

async function buscarRelacionadas(ultimaCategoria) {
  const Relacionadas = gql`
    query {
      obras(sort: ["${ultimaCategoria}"], limit: 10) {
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

  const { obras } = await obtenerDatos(`relacionadas${ruta.params.registro}`, Relacionadas);

  relacionadas.value = obras.map(definirDimsImagen);
}

definePageMeta({ layout: 'default', keepalive: true });

function cambiarVistaImagen() {
  vistaCompleta.value = !vistaCompleta.value;
}
function cambiarVistaLupa() {
  verLupa.value = !verLupa.value;
}
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

    <div id="contenedorDatos">
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

      <RegistroLugares :datos="obra.ubicacion" titulo="Ubicación actual" :punto="ubicacionMapa" />
      <RegistroLugares :datos="obra.ciudad_origen" titulo="Ciudad de origen" />
      <RegistroSingular class="medio" titulo="Fecha" :texto="obra.fechas.join(' - ')" />
      <RegistroLista class="medio" titulo="Técnicas" :datos="obra.tecnicas" ruta="tecnicas" relacion="tecnicas_id" />
      <RegistroLista class="medio" titulo="Categorías" :datos="obra.categorias" ruta="categorias" />
      <RegistroSingular class="medio" titulo="Donante" :datos="obra.donante" ruta="donantes" />
      <RegistroSingular class="medio" titulo="Relato visual" :datos="obra.relato_visual" ruta="relatos-visuales" />
      <RegistroSingular
        class="medio"
        titulo="Cartela - Filacteria"
        :datos="obra.cartela_filacteria"
        ruta="cartela-filacteria"
      />
      <RegistroSingular class="medio" titulo="Fisiognómica" :datos="obra.fisiognomica" ruta="fisiognomica" />
      <RegistroSingular
        class="medio"
        titulo="Fisiognómica Imagen"
        :datos="obra.fisiognomica_imagen"
        ruta="fisiognomica-imagen"
      />
      <RegistroSingular class="medio" titulo="Tipo gestual" :datos="obra.tipo_gestual" ruta="tipo-gestual" />
      <RegistroSingular
        class="medio"
        titulo="Complejo gestual"
        :datos="obra.complejo_gestual"
        ruta="complejo-gestual"
      />
      <RegistroSingular class="medio" titulo="Rostro" :datos="obra.rostro" ruta="rostros" />
      <RegistroSingular class="medio" titulo="Gesto Principal" :datos="obra.gesto1" ruta="gestos" />
      <!-- <RegistroLista titulo="Gestos" :datos="obra.gestos" class="medio" relacion="gestos_id" ruta="gestos" /> -->
      <RegistroLista titulo="Objetos" :datos="obra.objetos" class="medio" relacion="objetos_id" ruta="objetos" />
      <RegistroLista
        titulo="Personajes"
        :datos="obra.personajes"
        class="medio"
        relacion="personajes_id"
        ruta="personajes"
      />
      <RegistroLista titulo="Símbolos" :datos="obra.simbolos" class="medio" relacion="simbolos_id" ruta="simbolos" />
      <RegistroLista
        titulo="Escenarios"
        :datos="obra.escenarios"
        class="medio"
        relacion="escenarios_id"
        ruta="escenarios"
      />
      <RegistroLista
        titulo="Descriptores"
        :datos="obra.descriptores"
        class="medio"
        relacion="descriptores_id"
        ruta="descriptores"
      />
      <RegistroLista
        titulo="Características"
        :datos="obra.caracteristicas"
        class="medio"
        relacion="caracteristicas_id"
        ruta="caracteristicas-particulares"
      />

      <RegistroParrafos :datos="obra.iconotexto" titulo="Iconotexto" />
      <RegistroParrafos :datos="obra.comentario_bibliografico" titulo="Comentario bibliográfico" />
      <RegistroParrafos :datos="obra.sintesis" titulo="Síntesis" />
      <RegistroParrafos :datos="obra.fuente ? obra.fuente.descripcion : null" titulo="Fuente" />
    </div>

    <section id="contenedorGaleria" class="completo">
      <h2>Obras Relacionadas</h2>
      <GaleriaMosaico v-if="relacionadas" :obras="relacionadas" />
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
