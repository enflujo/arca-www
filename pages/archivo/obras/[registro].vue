<script setup>
import { gql, urlImagen } from '~~/utilidades/ayudas';

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

const Obra = gql`
  query {
    obras(filter: { registro: { _eq: ${ruta.params.registro} } }, limit: 1) {
      fecha_inicial
      fecha_final
      sintesis
      comentario_bibliografico
      iconotexto
      fuente { descripcion }

      categoria1 { id nombre }
      categoria2 { id nombre }
      categoria3 { id nombre }
      categoria4 { id nombre }
      categoria5 { id nombre }
      categoria6 { id nombre }
      
      donante { slug nombre }
      relato_visual { slug nombre }
      fisiognomica { slug nombre }
      fisiognomica_imagen { slug nombre }
      cartela_filacteria { slug nombre }
      rostro { slug nombre }
      tipo_gestual { slug nombre }
      complejo_gestual { slug nombre }

      ciudad_origen { id nombre pais { slug nombre } }
      ubicacion { id nombre ciudad { id nombre pais { slug nombre } } }

      autores { autores_id { id nombre apellido } }
      gestos { gestos_id { slug nombre } }
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
    const origen = [{ url: `/archivo/ciudades/${_obra.ciudad_origen.id}`, nombre: _obra.ciudad_origen.nombre }];

    if (_obra.ciudad_origen.pais) {
      origen.push({ url: `/archivo/paises/${_obra.ciudad_origen.pais.slug}`, nombre: _obra.ciudad_origen.pais.nombre });
    }

    _obra.ciudad_origen = origen;
  }

  if (_obra.ubicacion) {
    const ubicacion = [{ url: `/archivo/ubicaciones/${_obra.ubicacion.id}`, nombre: _obra.ubicacion.nombre }];

    if (_obra.ubicacion.ciudad) {
      ubicacion.push({ url: `/archivo/ciudades/${_obra.ubicacion.ciudad.id}`, nombre: _obra.ubicacion.ciudad.nombre });

      if (_obra.ubicacion.ciudad.pais) {
        ubicacion.push({
          url: `/archivo/paises/${_obra.ubicacion.ciudad.pais.slug}`,
          nombre: _obra.ubicacion.ciudad.pais.nombre,
        });
      }
    }

    _obra.ubicacion = ubicacion;
  }

  obra.value = _obra;
});

definePageMeta({ layout: 'default', keepalive: true });
</script>

<template>
  <Cargador v-if="pending" />

  <div id="contenedorObra" v-else>
    <h1>{{ datosGenerales[0].titulo }}</h1>
    <NuxtLink :to="`/archivo/autores/${obra.autores[0].autores_id.id}`">
      <h2>
        <span v-if="obra.autores[0].autores_id.nombre">{{ obra.autores[0].autores_id.nombre }}</span>
        {{ obra.autores[0].autores_id.apellido }}
      </h2></NuxtLink
    >

    <div id="contenedorImagen">
      <Lupa :src="urlImagen(datosGenerales[0].imagen.id, 'obra')" :alt="datosGenerales[0].titulo" />
    </div>

    <div id="contenedorInfo">
      <div class="datos">
        <span class="tituloDato">Fecha:</span> {{ obra.fecha_inicial }}
        <span v-if="obra.fecha_final">- {{ obra.fecha_final }}</span>
      </div>

      <div class="datos" v-if="obra.tecnicas.length">
        <span class="tituloDato">Técnica:</span>
        <span v-for="tecnica in obra.tecnicas" :key="tecnica.tecnicas_id.nombre">
          <NuxtLink :to="`/archivo/tecnicas/${tecnica.tecnicas_id.slug}`">
            {{ tecnica.tecnicas_id.nombre }}
          </NuxtLink></span
        >
      </div>

      <div class="datos" v-if="obra.ubicacion">
        <span class="tituloDato">Ubicación actual:</span>

        <span v-for="(lugar, i) in obra.ubicacion" :key="`ubicacion${lugar.url}`">
          <span v-if="i > 0" class="separador">|</span>

          <NuxtLink :to="lugar.url">
            {{ lugar.nombre }}
          </NuxtLink>
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

      <div class="datos" v-if="obra.donante.nombre">
        <span class="tituloDato">Donante:</span>
        <NuxtLink :to="`/archivo/donantes/${obra.donante.slug}`">
          {{ obra.donante.nombre }}
        </NuxtLink>
      </div>

      <div class="datos" v-if="obra.categorias.length">
        <span class="tituloDato">Categorías:</span>

        <ul class="lista">
          <li v-for="(categoria, i) in obra.categorias" :key="`categoria${categoria.id}`">
            <NuxtLink :to="`/archivo/categorias${i + 1}/${obra[categoria.ruta].id}`">{{
              obra[categoria.ruta].nombre
            }}</NuxtLink>
          </li>
        </ul>
      </div>

      <div class="datos" v-if="obra.relato_visual.nombre">
        <span class="tituloDato">Relato visual:</span>
        <NuxtLink :to="`/archivo/relatos-visuales/${obra.relato_visual.slug}`">
          {{ obra.relato_visual.nombre }}
        </NuxtLink>
      </div>

      <div class="datos" v-if="obra.fisiognomica.nombre">
        <span class="tituloDato">Fisiognómica:</span>
        <NuxtLink :to="`/archivo/fisiognomica/${obra.fisiognomica.slug}`">
          {{ obra.fisiognomica.nombre }}
        </NuxtLink>
      </div>

      <div class="datos" v-if="obra.fisiognomica_imagen.nombre">
        <span class="tituloDato">Fisiognómica Imagen:</span>
        <NuxtLink :to="`/archivo/fisiognomica-imagen/${obra.fisiognomica_imagen.slug}`">
          {{ obra.fisiognomica_imagen.nombre }}
        </NuxtLink>
      </div>

      <div class="datos" v-if="obra.cartela_filacteria.nombre">
        <span class="tituloDato">Cartela - Filacteria:</span>
        <NuxtLink :to="`/archivo/cartela-filacteria/${obra.cartela_filacteria.slug}`">
          {{ obra.cartela_filacteria.nombre }}
        </NuxtLink>
      </div>

      <div class="datos" v-if="obra.rostro.nombre">
        <span class="tituloDato">Rostro:</span>
        <NuxtLink :to="`/archivo/rostros/${obra.rostro.slug}`">
          {{ obra.rostro.nombre }}
        </NuxtLink>
      </div>

      <div class="datos" v-if="obra.tipo_gestual.nombre">
        <span class="tituloDato">Tipo gestual:</span>
        <NuxtLink :to="`/archivo/tipo-gestual/${obra.tipo_gestual.slug}`">{{ obra.tipo_gestual.nombre }}</NuxtLink>
      </div>

      <div class="datos" v-if="obra.complejo_gestual.nombre">
        <span class="tituloDato">Complejo gestual:</span>
        <NuxtLink :to="`/archivo/complejo-gestual/${obra.complejo_gestual.slug}`">
          {{ obra.complejo_gestual.nombre }}
        </NuxtLink>
      </div>

      <!--El 'v-if' comprueba que la lista de gestos contenga elementos y que no todos sean "No". 
        Si todos son "No", omite el campo-->
      <div
        class="datos"
        v-if="
          obra.gestos.length &&
          obra.gestos.every((gesto) => {
            gesto !== 'No';
          })
        "
      >
        <span class="tituloDato">Gestos:</span>
        <ul class="lista">
          <li v-for="gesto in obra.gestos" :key="gesto.gestos_id.nombre">
            <NuxtLink v-if="gesto.gestos_id.nombre !== 'No'" :to="`/archivo/gestos/${gesto.gestos_id.slug}`">
              {{ gesto.gestos_id.nombre }}
            </NuxtLink>
          </li>
        </ul>
      </div>

      <div class="datos" v-if="obra.objetos.length">
        <span class="tituloDato">Objetos:</span>
        <ul class="lista">
          <li v-for="objeto in obra.objetos" :key="objeto.objetos_id.nombre">
            <NuxtLink v-if="objeto.objetos_id.nombre" :to="`/archivo/objetos/${objeto.objetos_id.slug}`">
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
              :to="`/archivo/personajes/${personaje.personajes_id.slug}`"
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
            <NuxtLink v-if="simbolo.simbolos_id.nombre" :to="`/archivo/simbolos/${simbolo.simbolos_id.slug}`">
              {{ simbolo.simbolos_id.nombre }}
            </NuxtLink>
          </li>
        </ul>
      </div>

      <div class="datos" v-if="obra.escenarios.length">
        <span class="tituloDato">Escenarios:</span>
        <ul class="lista">
          <li v-for="escenario in obra.escenarios" :key="escenario.escenarios_id.nombre">
            <NuxtLink v-if="escenario.escenarios_id.nombre" :to="`/archivo/escenarios/${escenario.escenarios_id.slug}`">
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
              :to="`/archivo/descriptores/${descriptor.descriptores_id.slug}`"
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
              :to="`/archivo/caracteristicas-particulares/${caracteristica.caracteristicas_id.slug}`"
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
    </div>
  </div>
</template>

<style lang="scss" scoped>
#contenedorObra {
  display: block;
  margin: 2em auto;
  text-align: center;
}

#contenedorInfo {
  margin: 0 auto;
  width: 95%;
  display: flex;
  flex-direction: column;
}

.imagen {
  height: auto;
  width: 50vw;
  margin: 1em;
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
</style>
