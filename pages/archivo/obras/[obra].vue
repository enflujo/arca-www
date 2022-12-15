<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql, obtenerDatos, urlImagen } from '~~/utilidades/ayudas';

const cargando = ref(true);
const obra = ref(null);
const cerebroArchivo = usarArchivo();
const ruta = useRoute();

// Para cambiar de pestaña y mostrar otros datos
const pestana = ref('');

definePageMeta({ layout: 'default', keepalive: true });

onMounted(async () => {
  cerebroArchivo.paginaActual = 'obras';

  const Obra = gql`
  query {
    obras(filter: { id: { _eq: "${ruta.params.obra}" } }, limit: 1) {
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
          nombre
        }
        ciudad_origen {
          nombre
          pais {
            nombre
          }
        }
        ubicacion {
          nombre
          ciudad {
            nombre
            pais {
              nombre
            }
          }
        }
        autores {
          autores_id {
            nombre
            apellido
        }
      }
      relato_visual {
        nombre
      }
      tecnicas {
        tecnicas_id {
        nombre
        }
      }
    }
  }
  `;

  const { obras } = await obtenerDatos(Obra);
  obra.value = obras[0];

  console.log(obra.value);

  cargando.value = false;
});
</script>

<template>
  <Cargador v-if="cargando" />

  <div id="contenedorObra" v-if="obra">
    <h1>{{ obra.titulo }}</h1>
    <h2>
      <span v-if="obra.autores[0].autores_id.nombre">{{ obra.autores[0].autores_id.nombre }}, </span>
      {{ obra.autores[0].autores_id.apellido }}
    </h2>
    <div id="contenedorImagen"><img class="imagen" :src="urlImagen(obra.imagen.id)" :alt="obra.titulo" /></div>
    <p>
      Fecha: {{ obra.fecha_inicial }} <span v-if="obra.fecha_final">- {{ obra.fecha_final }}</span>
    </p>
    <p v-if="obra.tecnicas.length">
      Técnica: <span v-for="tecnica in obra.tecnicas" :key="tecnica.nombre">{{ tecnica.nombre }}</span>
    </p>
  </div>
</template>

<style lang="scss" scoped>
#contenedorObra {
  display: block;
  margin: 2em auto;
  text-align: center;
}
.imagen {
  height: auto;
  width: 50vw;
  margin: 1em;
}
</style>
