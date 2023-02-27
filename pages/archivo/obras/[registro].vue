<script setup>
import { gql, urlImagen } from '~~/utilidades/ayudas';

const cargando = ref(true);
const obra = ref(null);
const ruta = useRoute();

const Obra = gql`
  query {
    obras(filter: { registro: { _eq: ${ruta.params.registro} } }, limit: 1) {
      titulo
      sintesis
      comentario_bibliografico
      iconotexto
      categoria1 {
        nombre
        descripcion
      }
      categoria2 {
        nombre
      }
      categoria3 {
        nombre
      }
      categoria4 {
        nombre
      }
      categoria5 {
        nombre
      }
      categoria6 {
        nombre
      }
      fecha_inicial
      fecha_final
      fuente {
        descripcion
      }
      imagen {
        id
        title
      }
      donante {
        slug
        nombre
      }
      ciudad_origen {
        nombre
        pais {
          slug
          nombre
        }
      }
      ubicacion {
        nombre
        ciudad {
          nombre
          pais {
            slug
            nombre
          }
        }
      }
      autores {
        autores_id {
          id
          nombre
          apellido
        }
      }
      relato_visual {
        slug
        nombre
      }
      fisiognomica {
        slug
        nombre
      }
      fisiognomica_imagen {
        slug
        nombre
      }
      cartela_filacteria {
        slug
        nombre
      }
      rostro {
        slug
        nombre
      }
      tipo_gestual {
        nombre
      }
      complejo_gestual {
        nombre
      }
      gestos {
        gestos_id {
          slug
          nombre
        }
      }
      tecnicas {
        tecnicas_id {
          slug
          nombre
        }
      }
      objetos{
        objetos_id {
          slug
          nombre
        }
      }
      personajes{
        personajes_id {
          slug
          nombre
        }
      }
      simbolos{
        simbolos_id {
          slug
          nombre
        }
      }
      escenarios{
        escenarios_id {
          slug
          nombre
        }
      }
      descriptores{
        descriptores_id {
          slug
          nombre
        }
      }
      caracteristicas{
        caracteristicas_id {
          slug
          nombre
        }
      }
    }
  }
`;

const { obras } = await obtenerDatos('obra', Obra);
obra.value = obras[0];
cargando.value = false;

definePageMeta({ layout: 'default', keepalive: true });
</script>

<template>
  <div id="contenedorObra" v-if="obra">
    <h1>{{ obra.titulo }}</h1>
    <NuxtLink :to="`/archivo/autores/${obra.autores[0].autores_id.id}`">
      <h2>
        <span v-if="obra.autores[0].autores_id.nombre">{{ obra.autores[0].autores_id.nombre }} </span>
        {{ obra.autores[0].autores_id.apellido }}
      </h2></NuxtLink
    >

    <div id="contenedorImagen"><img class="imagen" :src="urlImagen(obra.imagen.id)" :alt="obra.titulo" /></div>
    <div id="contenedorInfo">
      <div class="datos">
        <span class="tituloDato">Fecha:</span> {{ obra.fecha_inicial }}
        <span v-if="obra.fecha_final">- {{ obra.fecha_final }}</span>
      </div>

      <div class="datos" v-if="obra.tecnicas.length">
        <span class="tituloDato">Técnica:</span>
        <span v-for="tecnica in obra.tecnicas" :key="tecnica.tecnicas_id.nombre">
          <NuxtLink :to="`/archivo/tecnicas/${tecnica.tecnicas_id.slug}`">{{
            tecnica.tecnicas_id.nombre
          }}</NuxtLink></span
        >
      </div>

      <!--POR HACER: link a ubicación además de país-->
      <div class="datos">
        <span class="tituloDato">Ubicación actual:</span>
        <span v-if="obra.ubicacion.nombre">
          {{ obra.ubicacion.nombre }} ({{ obra.ubicacion.ciudad.nombre
          }}<NuxtLink v-if="obra.ubicacion.ciudad.pais" :to="`/archivo/paises/${obra.ubicacion.ciudad.pais.slug}`"
            >, {{ obra.ubicacion.ciudad.pais.nombre }}</NuxtLink
          >)</span
        >
      </div>

      <!--Comprueba si existen la ciudad de ubicación actual y la ciudad de origen y, 
      si existen y son distintas, muestra la ciudad de origen-->
      <div
        class="datos"
        v-if="
          obra.ubicacion.ciudad.nombre &&
          obra.ciudad_origen &&
          obra.ubicacion.ciudad.pais &&
          obra.ciudad_origen.pais.nombre &&
          obra.ubicacion.ciudad.nombre !== obra.ciudad_origen.nombre &&
          obra.ubicacion.ciudad.pais.nombre !== obra.ciudad_origen.pais.nombre
        "
      >
        <span class="tituloDato">Ciudad de origen:</span> {{ obra.ciudad_origen.nombre }},
        <NuxtLink v-if="obra.ciudad_origen.pais" :to="`/archivo/paises/${obra.ciudad_origen.pais.slug}`"
          >{{ obra.ciudad_origen.pais.nombre }}
        </NuxtLink>
      </div>

      <div class="datos" v-if="obra.donante.nombre">
        <span class="tituloDato">Donante:</span>
        <NuxtLink :to="`/archivo/donantes/${obra.donante.slug}`"> {{ obra.donante.nombre }} </NuxtLink>
      </div>

      <!-- POR HACER: Arreglar enlaces -->
      <div class="datos" v-if="obra.categoria1.nombre">
        <span class="tituloDato">Categorías:</span>
        <ul class="lista">
          <li v-if="obra.categoria1.nombre">
            <NuxtLink :to="`/archivo/categorias/`">{{ obra.categoria1.nombre }}</NuxtLink>
          </li>
          <li v-if="obra.categoria2 && obra.categoria2.nombre">
            <NuxtLink :to="`/archivo/categorias/`">{{ obra.categoria2.nombre }}</NuxtLink>
          </li>
          <li v-if="obra.categoria3 && obra.categoria3.nombre">
            <NuxtLink :to="`/archivo/categorias/`">{{ obra.categoria3.nombre }}</NuxtLink>
          </li>
          <li v-if="obra.categoria4 && obra.categoria4.nombre">
            <NuxtLink :to="`/archivo/categorias/`">{{ obra.categoria4.nombre }}</NuxtLink>
          </li>
          <li v-if="obra.categoria5 && obra.categoria5.nombre">
            <NuxtLink :to="`/archivo/categorias/`">{{ obra.categoria5.nombre }}</NuxtLink>
          </li>
          <li v-if="obra.categoria6 && obra.categoria6.nombre">
            <NuxtLink :to="`/archivo/categorias/`">{{ obra.categoria6.nombre }}</NuxtLink>
          </li>
        </ul>
      </div>

      <div class="datos" v-if="obra.relato_visual.nombre">
        <span class="tituloDato">Relato visual:</span>
        <NuxtLink :to="`/archivo/relatos-visuales/${obra.relato_visual.slug}`">{{
          obra.relato_visual.nombre
        }}</NuxtLink>
      </div>

      <div class="datos" v-if="obra.fisiognomica.nombre">
        <span class="tituloDato">Fisiognómica:</span>
        <NuxtLink :to="`/archivo/fisiognomica/${obra.fisiognomica.slug}`"> {{ obra.fisiognomica.nombre }}</NuxtLink>
      </div>

      <div class="datos" v-if="obra.fisiognomica_imagen.nombre">
        <span class="tituloDato">Fisiognómica Imagen:</span>
        <NuxtLink :to="`/archivo/fisiognomica-imagen/${obra.fisiognomica_imagen.slug}`">
          {{ obra.fisiognomica_imagen.nombre }}</NuxtLink
        >
      </div>

      <div class="datos" v-if="obra.cartela_filacteria.nombre">
        <span class="tituloDato">Cartela - Filacteria:</span>
        <NuxtLink :to="`/archivo/cartela-filacteria/${obra.cartela_filacteria.slug}`">
          {{ obra.cartela_filacteria.nombre }}</NuxtLink
        >
      </div>

      <div class="datos" v-if="obra.rostro.nombre">
        <span class="tituloDato">Rostro:</span>
        <NuxtLink :to="`/archivo/rostros/${obra.rostro.slug}`"> {{ obra.rostro.nombre }} </NuxtLink>
      </div>

      <div class="datos" v-if="obra.tipo_gestual.nombre">
        <span class="tituloDato">Tipo gestual:</span>
        <span> {{ obra.tipo_gestual.nombre }}</span>
      </div>

      <div class="datos" v-if="obra.complejo_gestual.nombre">
        <span class="tituloDato">Complejo gestual:</span>
        <span> {{ obra.complejo_gestual.nombre }}</span>
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
            <NuxtLink v-if="objeto.objetos_id.nombre" :to="`/archivo/objetos/${objeto.objetos_id.slug}`"
              >{{ objeto.objetos_id.nombre }}
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
        <span> {{ obra.comentario_bibliografico }}</span>
      </div>

      <div class="datos" v-if="obra.sintesis">
        <span class="tituloDato">Síntesis:</span> <span> {{ obra.sintesis }}</span>
      </div>

      <div class="datos" v-if="obra.fuente.descripcion">
        <span class="tituloDato">Fuente:</span>
        <span v-html="obra.fuente.descripcion"></span>
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
.lista {
  // list-style-type: disc;
  // list-style-position: inside;
}
</style>
