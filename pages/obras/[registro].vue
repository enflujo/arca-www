<script setup>
import { definirDimsImagen, gql, urlImagen } from '~~/utilidades/ayudas';

/**
 * Operaciones en el servidor
 */
const ruta = useRoute();
const ObraGeneral = gql`
query {
  obras(filter: { registro: { _eq: ${ruta.params.registro} } }, limit: 1) {
    titulo,
    imagen { id title }
  }
}
`;

const { obras: datosGenerales } = await obtenerDatos(`obraGeneral${ruta.params.registro}`, ObraGeneral);

useHead(elementosCabeza({ titulo: datosGenerales[0].titulo, banner: datosGenerales[0].imagen }, ruta.path));

// En el cliente
const obra = ref(null);
const relacionadas = ref(null);
const ubicacionMapa = ref(null);
const sinGesto = ref(null);

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
      gestos(sort: ["gestos_id.slug"]) { gestos_id { codigo slug nombre } }
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
  // sinGesto.value = (gesto) => gesto.gestos_id.nombre !== 'No';

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
</script>

<template>
  <Cargador v-if="pending" />
  <div id="contenedorObra" v-else>
    <div id="contenedorBotoneImagen">
      <div id="contenedorBotones">
        <button id="zoomAdentro"></button>
        <button id="zoomAfuera"></button>
        <button id="lupa"></button>
      </div>
      <div id="contenedorImagen">
        <div id="imagen">
          <Lupa :src="urlImagen(datosGenerales[0].imagen.id, 'obra')" :alt="datosGenerales[0].titulo" />
        </div>
      </div>
    </div>
    <div id="contenedorDatos">
      <section id="contenedorPrimerBloque">
        <div id="contenedorTituloAutor">
          <h1>{{ datosGenerales[0].titulo }}</h1>

          <NuxtLink :to="`/autores/${obra.autores[0].autores_id.id}`">
            <h2 class="autor">
              <span v-if="obra.autores[0].autores_id.nombre">{{ obra.autores[0].autores_id.nombre }}</span>
              {{ obra.autores[0].autores_id.apellido }}
            </h2></NuxtLink
          >
        </div>

        <div id="registro">{{ obra.registro }}</div>
      </section>

      <RegistroLugares :datos="obra.ubicacion" titulo="Ubicación actual" />
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
      <RegistroLista titulo="Gestos" :datos="obra.gestos" class="medio" relacion="gestos_id" ruta="gestos" />
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

      <div id="contenedorInfo">
        <VistaMapaPunto :punto="ubicacionMapa" />
      </div>

      <div id="contenedorGaleria">
        <h2>Obras Relacionadas</h2>
        <GaleriaMosaico v-if="relacionadas" :obras="relacionadas" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
#contenedorObra {
  display: flex;
  margin: 2em auto;
  width: 95vw;

  #contenedorBotoneImagen {
    display: flex;
    width: 50vw;
    height: 75vh;
  }

  #contenedorBotones {
    width: 14%;
  }

  #contenedorImagen {
    display: flex;
    justify-content: center;
    width: 73%;
  }

  #imagen {
    margin: 0;
  }

  #contenedorDatos {
    width: 50vw;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  #contenedorPrimerBloque {
    display: flex;
    justify-content: space-between;
  }

  #contenedorTituloAutor {
    width: 75%;

    h1 {
      margin-bottom: 0;
    }

    .autor {
      text-transform: uppercase;
      font-size: 1.2em;
    }
  }

  #registro {
    padding: 0.5em;
    font-family: var(--fuentePrincipal);
    border: 1px solid var(--profundidad);
    height: fit-content;
  }

  section {
    display: flex;
    flex-basis: 100%;
    border-top: 2px solid var(--dolor);
    padding: 0.8em 0;

    h3 {
      font-weight: bold;
      margin-right: 0.5em;
      font-size: 1em;
      width: 130px;
    }

    .contenido {
      flex: 1;
    }
  }

  .medio {
    flex-basis: 48%;
    display: flex;
    // margin-right: 3em;
  }

  .lista {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin: 0 0 1.5em;

    li {
      border: 1px solid $rojoCerezo;
      margin: 0.2em 0.2em 0.2em 0;
      height: fit-content;

      a {
        padding: 0.4em;
        display: block;
      }

      &:hover {
        background-color: $rojoCerezo;

        a,
        a:link {
          color: $claridad;
        }
      }
    }
  }

  #contenedorInfo {
    margin: 0 auto;
    width: 95%;
    display: flex;
    flex-direction: column;
  }

  .datos {
    display: flex;
    text-align: left;
    font-family: var(--fuenteParrafos);
  }

  .separador {
    padding: 0 0.3em;
  }

  #contenedorGaleria {
    max-width: 90%;
    margin: 0 auto;
  }
}
</style>
