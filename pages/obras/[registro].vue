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

      autores { autores_id { id nombre apellido } }
      gestos { gestos_id { codigo slug nombre } }
      tecnicas { tecnicas_id { slug nombre } }
      objetos { objetos_id { slug nombre } }
      personajes { personajes_id { slug nombre muerte} }
      simbolos { simbolos_id { slug nombre } }
      escenarios { escenarios_id { slug nombre } }
      descriptores { descriptores_id { slug nombre } }
      caracteristicas { caracteristicas_id { slug nombre } }
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
      _obra[coleccion].ruta = coleccion;
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
  sinGesto.value = (gesto) => gesto.gestos_id.nombre !== 'No';

  buscarRelacionadas(_obra.categorias[_obra.categorias.length - 1].ruta);
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
        autores {diseno-obras-individuales
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
      <div id="contenedorPrimerBloque">
        <div id="contenedorTituloAutor">
          <h1>{{ datosGenerales[0].titulo }}</h1>
          <NuxtLink :to="`/autores/${obra.autores[0].autores_id.id}`">
            <h2>
              <span v-if="obra.autores[0].autores_id.nombre">{{ obra.autores[0].autores_id.nombre }}</span>
              {{ obra.autores[0].autores_id.apellido }}
            </h2></NuxtLink
          >
        </div>
        <div id="contenedorRegistro">
          <span id="registro">{{ obra.registro }} </span>
        </div>
      </div>
      <div id="contenedorSegundoBloque" class="bloquesDatos">
        <div class="datos" v-if="obra.ubicacion">
          <span class="tituloDato">Ubicación actual:</span>

          <span v-for="(lugar, i) in obra.ubicacion" :key="`ubicacion${lugar.url}`">
            <span v-if="i > 0" class="separador">|</span>

            <NuxtLink :to="lugar.url"> {{ lugar.nombre }} </NuxtLink>
          </span>
        </div>

        <!--Comprueba si existen la ciudad de ubicación actual y la ciudad de origen y, 
      si existen y son distintas, muestra la ciudad de origen-->
        <div class="datos" v-if="obra.ciudad_origen">
          <span class="tituloDato">Ciudad de origen:</span>

          <span v-for="(lugar, i) in obra.ciudad_origen" :key="`lugar${lugar.url}`">
            <span v-if="i > 0" class="separador">|</span>

            <NuxtLink :to="lugar.url">
              {{ lugar.nombre }}
            </NuxtLink>
          </span>
        </div>
      </div>
      <div id="contenedorInfo">
        <div class="datos">
          <span class="tituloDato">Fecha:</span> {{ obra.fecha_inicial }}
          <span v-if="obra.fecha_final">- {{ obra.fecha_final }}</span>
        </div>

        <div class="datos" v-if="obra.tecnicas.length">
          <span class="tituloDato">Técnica:</span>
          <span v-for="tecnica in obra.tecnicas" :key="tecnica.tecnicas_id.nombre">
            <NuxtLink :to="`/tecnicas/${tecnica.tecnicas_id.slug}`">
              {{ tecnica.tecnicas_id.nombre }}
            </NuxtLink></span
          >
        </div>

        <div class="datos" v-if="obra.donante.nombre">
          <span class="tituloDato">Donante:</span>
          <NuxtLink :to="`/donantes/${obra.donante.slug}`">
            {{ obra.donante.nombre }}
          </NuxtLink>
        </div>

        <div class="datos" v-if="obra.categorias.length">
          <span class="tituloDato">Categorías:</span>

          <ul class="lista">
            <li v-for="(categoria, i) in obra.categorias" :key="`categoria${categoria.slug}`">
              <NuxtLink :to="`/categorias${i + 1}/${obra[categoria.ruta].slug}`">{{
                obra[categoria.ruta].nombre
              }}</NuxtLink>
            </li>
          </ul>
        </div>

        <div class="datos" v-if="obra.relato_visual.nombre">
          <span class="tituloDato">Relato visual:</span>
          <NuxtLink :to="`/relatos-visuales/${obra.relato_visual.slug}`">
            {{ obra.relato_visual.nombre }}
          </NuxtLink>
        </div>

        <div class="datos" v-if="obra.fisiognomica.nombre">
          <span class="tituloDato">Fisiognómica:</span>
          <NuxtLink :to="`/fisiognomica/${obra.fisiognomica.slug}`">
            {{ obra.fisiognomica.nombre }}
          </NuxtLink>
        </div>

        <div class="datos" v-if="obra.fisiognomica_imagen.nombre">
          <span class="tituloDato">Fisiognómica Imagen:</span>
          <NuxtLink :to="`/fisiognomica-imagen/${obra.fisiognomica_imagen.slug}`">
            {{ obra.fisiognomica_imagen.nombre }}
          </NuxtLink>
        </div>

        <div class="datos" v-if="obra.cartela_filacteria.nombre">
          <span class="tituloDato">Cartela - Filacteria:</span>
          <NuxtLink :to="`/cartela-filacteria/${obra.cartela_filacteria.slug}`">
            {{ obra.cartela_filacteria.nombre }}
          </NuxtLink>
        </div>

        <div class="datos" v-if="obra.rostro.nombre">
          <span class="tituloDato">Rostro:</span>
          <NuxtLink :to="`/rostros/${obra.rostro.slug}`">
            {{ obra.rostro.nombre }}
          </NuxtLink>
        </div>

        <div class="datos" v-if="obra.tipo_gestual.nombre">
          <span class="tituloDato">Tipo gestual:</span>
          <NuxtLink :to="`/tipo-gestual/${obra.tipo_gestual.slug}`">{{ obra.tipo_gestual.nombre }}</NuxtLink>
        </div>

        <div class="datos" v-if="obra.complejo_gestual.nombre">
          <span class="tituloDato">Complejo gestual:</span>
          <NuxtLink :to="`/complejo-gestual/${obra.complejo_gestual.slug}`">
            {{ obra.complejo_gestual.nombre }}
          </NuxtLink>
        </div>

        <!--El 'v-if' comprueba que la lista de gestos contenga elementos y que no todos sean "No". 
        Si todos son "No", omite el campo-->
        <div class="datos" v-if="obra.gestos.length && obra.gestos.some(sinGesto)">
          <span class="tituloDato">Gestos:</span>
          <ul class="lista">
            <li v-for="gesto in obra.gestos" :key="gesto.gestos_id.nombre">
              <NuxtLink v-if="gesto.gestos_id.nombre !== 'No'" :to="`/gestos/${gesto.gestos_id.slug}`">
                {{ gesto.gestos_id.codigo }} | {{ gesto.gestos_id.nombre }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div class="datos" v-if="obra.objetos.length">
          <span class="tituloDato">Objetos:</span>
          <ul class="lista">
            <li v-for="objeto in obra.objetos" :key="objeto.objetos_id.nombre">
              <NuxtLink v-if="objeto.objetos_id.nombre" :to="`/objetos/${objeto.objetos_id.slug}`">
                {{ objeto.objetos_id.nombre }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div class="datos" v-if="obra.personajes.length">
          <span class="tituloDato">Personajes:</span>
          <ul class="lista">
            <li v-for="personaje in obra.personajes" :key="personaje.personajes_id.nombre">
              <NuxtLink
                v-if="personaje.personajes_id.nombre !== 'No'"
                :to="`/personajes/${personaje.personajes_id.slug}`"
              >
                {{ personaje.personajes_id.nombre }}
                <span v-if="personaje.personajes_id.muerte">(m. {{ personaje.personajes_id.muerte }})</span>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div class="datos" v-if="obra.simbolos.length">
          <span class="tituloDato">Símbolos:</span>
          <ul class="lista">
            <li v-for="simbolo in obra.simbolos" :key="simbolo.simbolos_id.nombre">
              <NuxtLink v-if="simbolo.simbolos_id.nombre" :to="`/simbolos/${simbolo.simbolos_id.slug}`">
                {{ simbolo.simbolos_id.nombre }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div class="datos" v-if="obra.escenarios.length">
          <span class="tituloDato">Escenarios:</span>
          <ul class="lista">
            <li v-for="escenario in obra.escenarios" :key="escenario.escenarios_id.nombre">
              <NuxtLink v-if="escenario.escenarios_id.nombre" :to="`/escenarios/${escenario.escenarios_id.slug}`">
                {{ escenario.escenarios_id.nombre }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div class="datos" v-if="obra.descriptores.length">
          <span class="tituloDato">Descriptores:</span>
          <ul class="lista">
            <li v-for="descriptor in obra.descriptores" :key="descriptor.descriptores_id.nombre">
              <NuxtLink
                v-if="descriptor.descriptores_id.nombre"
                :to="`/descriptores/${descriptor.descriptores_id.slug}`"
              >
                {{ descriptor.descriptores_id.nombre }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div class="datos" v-if="obra.caracteristicas.length">
          <span class="tituloDato">Características:</span>
          <ul class="lista">
            <li v-for="caracteristica in obra.caracteristicas" :key="caracteristica.caracteristicas_id.nombre">
              <NuxtLink
                v-if="caracteristica.caracteristicas_id.nombre"
                :to="`/caracteristicas-particulares/${caracteristica.caracteristicas_id.slug}`"
              >
                {{ caracteristica.caracteristicas_id.nombre }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div class="datos" v-if="obra.iconotexto">
          <span class="tituloDato">Iconotexto:</span>
          <span> {{ obra.iconotexto }}</span>
        </div>

        <div class="datos" v-if="obra.comentario_bibliografico">
          <span class="tituloDato">Comentario bibliográfico:</span>
          <span v-html="obra.comentario_bibliografico"></span>
        </div>

        <div class="datos" v-if="obra.sintesis">
          <span class="tituloDato">Síntesis:</span> <span>{{ obra.sintesis }}</span>
        </div>

        <div class="datos" v-if="obra.fuente.descripcion">
          <span class="tituloDato">Fuente:</span>
          <div v-html="obra.fuente.descripcion"></div>
        </div>
        <VistaMapaPunto :punto="ubicacionMapa" />
      </div>

      <div id="contenedorGaleria">
        <h2>Obras Relacionadas</h2>
        <GaleriaMosaico v-if="relacionadas" :obras="relacionadas" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#contenedorObra {
  display: flex;
  margin: 2em auto;
}

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
  width: 86%;
}

#imagen {
  width: 83.3%;
  height: 83.3%;
  margin: 0;
}
#contenedorDatos {
  display: flex;
  flex-direction: column;
  width: 50vw;
  margin: 0;
}

#contenedorPrimerBloque {
  display: flex;
  width: 87.5%;
  margin: 0;
  margin-bottom: 0.5em;
}
#contenedorTituloAutor {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 75%;
  margin: 0;

  h1 {
    margin-bottom: 0;
  }
}

#contenedorRegistro {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 25%;
}
#registro {
  padding: 0.5em;
  font-family: var(--fuentePrincipal);
  border: 1px solid var(--profundidad);
}

.bloquesDatos {
  width: 87.5%;
  border-top: 3px solid var(--dolor);
}
#contenedorSegundoBloque {
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

.tituloDato {
  font-weight: bold;
  margin-right: 0.5em;
}

.separador {
  padding: 0 0.3em;
}

#contenedorGaleria {
  max-width: 90%;
  margin: 0 auto;
}
</style>
