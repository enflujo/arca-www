<script setup>
import { usarGeneral } from '~~/cerebros/general';
import { usarArchivo } from '~~/cerebros/archivo';
import { extraerPrimeraLetra, gql, obtenerDatos } from '~~/utilidades/ayudas';

const cargando = ref(true);
const cerebro = usarGeneral();
const cerebroArchivo = usarArchivo();
const pagina = ref({});
const obras = ref([]);
const autores = ref([]);
const paises = ref([]);
const categorias = ref([]);
const cartelaFilacteria = ref([]);
const donantes = ref([]);
const escenarios = ref([]);
const fisiognomica = ref([]);
const fisiognomicaImagen = ref([]);
const gestos = ref([]);
const objetos = ref([]);
const personajes = ref([]);
const relatos = ref([]);
const rostros = ref([]);
const simbolos = ref([]);
const tecnicas = ref([]);
const iniciales = ref([]);
const inicialSeleccionada = ref('');

const obrasSeleccionadas = computed(() => cerebro.buscador.seleccionados);
const busquedaActual = computed(() => cerebro.buscador.busquedaActual);

const paginaActual = computed(() => cerebroArchivo.paginaActual);

onMounted(async () => {
  const ArchivoMenuBuscador = gql`
    query {
      autores(limit: -1) {
        apellido
      }

      # Número de ciudades asociadas al país NO es igual a 0
      paises(filter: { ciudades_func: { count: { _neq: 0 } } }) {
        nombre
        slug
      }
    }
  `;
  const datos = await obtenerDatos(ArchivoMenuBuscador);

  paises.value = datos.paises;

  const inicialesAutores = new Set();

  datos.autores.forEach((autor) => {
    const inicial = extraerPrimeraLetra(autor.apellido).toUpperCase();
    inicialesAutores.add(inicial);
  });

  autores.value = Array.from(inicialesAutores).sort();

  cargando.value = false;
});

// function urlImagen(objImg, key) {
//   return objImg && objImg.id ? urlImagen(objImg.id, key) : '';
// }

function desplegar(evento) {
  const contenedor = evento.target.parentElement;
  contenedor.classList.toggle('abierto');
}

// function abrir(evento) {
//   const contenedor = evento.target.parentElement;
//   contenedor.classList.toggle('cerrado');
//   // contenedor.classList.toggle('categoriaLarga');
// }

function cargarIniciales() {}

// function elegirInicial(inicial) {
//   inicialSeleccionada.value = inicial;
// }

// function autoresPorInicial(inicial) {
//   return autores.value
//     .filter((autor) => extraerPrimeraLetra(autor.apellido) === inicial)
//     .sort((a, b) => {
//       const apellidoA = eliminarTildes(a.apellido.toUpperCase());
//       const apellidoB = eliminarTildes(b.apellido.toUpperCase());

//       if (apellidoA < apellidoB) return -1;
//       if (apellidoA > apellidoB) return 1;
//       return 0;
//     });
// }

// function menuPorInicial(inicial, menu) {
//   return [menu].value.filter((item) => extraerPrimeraLetra(item.nombre) === inicial);
// }

/**
   *         # paises_lista(sort: ["sort", "nombre_es"], limit: -1) {
        #   nombre_es
        # }

        # obras(limit: 50) {
        #   arca_id
        #   clasificacion {
        #     categorias_lista_id {
        #       nombre
        #       ascendencia
        #     }
        #   }
        # }

        # categorias_lista(sort: ["sort", "nombre"], filter: { arca_id: { _lt: 12 } }) {
        #   id
        #   nombre
        # }
        # caracteristicas_particulares_lista(sort: ["sort", "nombre"], limit: -1) {
        #   id
        #   nombre
        # }
        # cartela_filacteria_lista(sort: ["sort", "nombre"], limit: -1) {
        #   arca_id
        #   nombre
        # }
        # donante_lista(sort: ["sort", "nombre"], limit: -1) {
        #   arca_id
        #   nombre
        # }
        # escenarios_lista(sort: ["sort", "nombre"], limit: -1) {
        #   arca_id
        #   nombre
        # }
        # fisiognomica_lista(sort: ["sort", "nombre"], limit: -1) {
        #   id
        #   nombre
        # }
        # gestos_lista(sort: ["sort", "nombre"], limit: -1) {
        #   arca_id
        #   nombre
        # }
        # objetos_lista(sort: ["sort", "nombre"], limit: -1) {
        #   arca_id
        #   nombre
        # }
        # relato_visual_lista(sort: ["sort", "nombre"], limit: -1) {
        #   arca_id
        #   nombre
        # }
        # simbolos_lista(sort: ["sort", "nombre"], limit: -1) {
        #   id
        #   nombre
        # }
        # tecnica_lista(sort: ["sort", "nombre"], limit: -1) {
        #   arca_id
        #   nombre
        # }
   */
// async fetch() {
// const {
// autores,
// paises,
// obra,

// categorias_lista,
// caracteristicas_particulares_lista,
// cartela_filacteria_lista,
// donante_lista,
// escenarios_lista,
// fisiognomica_lista,
// gestos_lista,
// objetos_lista,
// relato_visual_lista,
// simbolos_lista,
// tecnica_lista,
// } = await this.$graphql.principal.request(query);

// this.obras = obra;
// if (autores && autores.length) {
//   this.autores = autores;
// }

// if (paises && paises.length) {
//   this.paises = paises;
// }

// if (categorias_lista && categorias_lista.length) {
//   this.categorias = categorias_lista;
// }

// if (cartela_filacteria_lista && cartela_filacteria_lista.length) {
//   this.cartelaFilacteria = cartela_filacteria_lista;
// }
// if (donante_lista && donante_lista.length) {
//   this.donantes = donante_lista;
// }
// if (escenarios_lista && escenarios_lista.length) {
//   this.escenarios = escenarios_lista;
// }
// if (fisiognomica_lista && fisiognomica_lista.length) {
//   this.fisiognomica = fisiognomica_lista;
// }
// if (gestos_lista && gestos_lista.length) {
//   this.gestos = gestos_lista;
// }
// if (objetos_lista && objetos_lista.length) {
//   this.objetos = objetos_lista;
// }
// if (relato_visual_lista && relato_visual_lista.length) {
//   this.relatos = relato_visual_lista;
// }
// if (simbolos_lista && simbolos_lista.length) {
//   this.simbolos = simbolos_lista;
// }
// if (tecnica_lista && tecnica_lista.length) {
//   this.tecnicas = tecnica_lista;
// } else {
//   if (process.server) {
//     this.$nuxt.context.res.statusCode = 404;
//   }
//   throw new Error('La página no existe');
// }

// TODO: ¿Cómo se resuelve de nuevo la lista de categorías?
// obra.forEach((element) => console.log(element.clasificacion[0].categorias_lista_id.nombre));

/* if (obra && obra.length) {
      const categorias = {};
      obra.forEach((work) => {
        const cat1 = work.category_1_id ? work.category_1_id : null;
        const cat2 = work.category_2_id ? work.category_2_id.name : null;
        const cat3 = work.category_3_id ? work.category_3_id.name : null;
        const cat4 = work.category_4_id ? work.category_4_id.name : null;
        const cat5 = work.category_5_id ? work.category_5_id.name : null;
        if (cat1) {
          if (!categorias[cat1.name]) {
            categorias[cat1.name] = {};
          }
          if (cat2) {
            if (!categorias[cat1.name][cat2]) {
              categorias[cat1.name][cat2] = {};
            }
            if (cat3) {
              if (!categorias[cat1.name][cat2][cat3]) {
                categorias[cat1.name][cat2][cat3] = {};
              }
              if (cat4) {
                if (!categorias[cat1.name][cat2][cat3][cat4]) {
                  categorias[cat1.name][cat2][cat3][cat4] = {};
                }
                if (cat5) {
                  if (!categorias[cat1.name][cat2][cat3][cat4][cat5]) {
                    categorias[cat1.name][cat2][cat3][cat4][cat5] = {};
                  }
                }
              }
            }
          }
        }
      });
      this.categorias = categorias;
    } */
//   this.cargarIniciales();
// },
</script>

<template>
  <div id="contenedorBuscador">
    <NuxtLink :to="'/'">
      <h2 class="logo-texto">ARCA</h2>
    </NuxtLink>

    <Buscador />

    <nav class="opcionesBuscador">
      <div class="opcion" :class="paginaActual === 'categorias' ? 'abierto' : ''">
        <NuxtLink class="seccion" to="/archivo/categorias">Categorías</NuxtLink>

        <ul class="opciones">
          <li v-for="(categoria, i) in categorias" :key="`categoria${i}`" class="enlace-menu">
            <NuxtLink :to="`/archivo/${categoria.id}`">{{ categoria.nombre }}</NuxtLink>
          </li>
        </ul>
      </div>

      <div class="opcion" :class="paginaActual === 'autores' ? 'abierto' : ''">
        <NuxtLink to="/archivo/autores" class="seccion">Autores</NuxtLink>

        <ul class="iniciales">
          <li
            v-for="(inicial, i) in autores"
            :key="`inicial${i}`"
            :class="`inicial ${inicialSeleccionada === inicial ? 'activo' : ''}`"
            @click="elegirInicial(inicial)"
          >
            {{ inicial }}
          </li>
        </ul>
      </div>

      <div class="opcion" :class="paginaActual === 'paises' ? 'abierto' : ''">
        <NuxtLink class="seccion" to="/archivo/ubicaciones">Ubicaciones</NuxtLink>

        <ul class="opciones">
          <li v-for="(pais, i) in paises" :key="`pais${i}`" class="enlace-menu">
            <NuxtLink :to="`/archivo/ubicaciones/${pais.slug}`">{{ pais.nombre }}</NuxtLink>
          </li>
        </ul>
      </div>

      <div class="opcion">
        <NuxtLink class="seccion" to="/archivo/cartela-filacteria">Cartela - Filacteria</NuxtLink>
        <ul class="opciones">
          <li v-for="(elemento, i) in cartelaFilacteria" :key="`cartela${i}`" class="enlace-menu">
            <NuxtLink :to="`/archivo/cartela-filacteria/${elemento.slug}`">{{ elemento.nombre }}</NuxtLink>
          </li>
        </ul>
      </div>

      <div class="opcion">
        <NuxtLink class="seccion" to="/archivo/donantes">Donantes</NuxtLink>
        <ul class="opciones">
          <li v-for="(donante, i) in donantes" :key="`donante${i}`" class="enlace-menu">
            <NuxtLink :to="`/archivo/donantes/${donante.slug}`">{{ donante.nombre }}</NuxtLink>
          </li>
        </ul>
      </div>

      <div class="opcion">
        <NuxtLink class="seccion" to="/archivo/escenarios">Escenarios</NuxtLink>
        <ul class="opciones">
          <li v-for="(escenario, i) in escenarios" :key="`escenario${i}`" class="enlace-menu">
            <NuxtLink :to="`/archivo/escenarios/${escenario.slug}`">{{ escenario.nombre }}</NuxtLink>
          </li>
        </ul>
      </div>

      <div class="opcion">
        <NuxtLink class="seccion" to="/archivo/fisiognomica">Fisiognómica</NuxtLink>
        <ul class="opciones">
          <li v-for="(elemento, i) in fisiognomica" :key="`fisiognomica${i}`" class="enlace-menu">
            <NuxtLink :to="`/archivo/fisiognomica/${elemento.slug}`">{{ elemento.nombre }}</NuxtLink>
          </li>
        </ul>
      </div>

      <div class="opcion">
        <NuxtLink class="seccion" to="/archivo/fisiognomica-imagen">Fisiognómica Imagen</NuxtLink>
        <ul class="opciones">
          <li v-for="(elemento, i) in fisiognomicaImagen" :key="`fisiognomicaImagen${i}`" class="enlace-menu">
            <NuxtLink :to="`/archivo/fisiognomica-imagen/${elemento.slug}`">{{ elemento.nombre }}</NuxtLink>
          </li>
        </ul>
      </div>

      <div class="opcion">
        <NuxtLink class="seccion" to="/archivo/gestos">Gestos</NuxtLink>

        <ul class="opciones">
          <li v-for="(gesto, i) in gestos" :key="`gesto${i}`" class="enlace-menu">
            <NuxtLink :to="`/archivo/gestos/${gesto.slug}`">{{ gesto.nombre }}</NuxtLink>
          </li>
        </ul>
      </div>

      <div class="opcion">
        <NuxtLink class="seccion" to="/archivo/objetos">Objetos</NuxtLink>

        <ul class="opciones">
          <li v-for="(objeto, i) in objetos" :key="`objeto${i}`" class="enlace-menu">
            <NuxtLink :to="`/archivo/objetos/${objeto.slug}`">{{ objeto.nombre }}</NuxtLink>
          </li>
        </ul>
      </div>

      <div class="opcion">
        <NuxtLink class="seccion" to="/archivo/personajes">Personajes</NuxtLink>

        <ul class="opciones">
          <li v-for="(personaje, i) in personajes" :key="`personaje${i}`" class="enlace-menu">
            <NuxtLink :to="`/archivo/personajes/${personaje.slug}`">{{ personaje.nombre }}</NuxtLink>
          </li>
        </ul>
      </div>

      <div class="opcion">
        <NuxtLink class="seccion" to="/archivo/relatos-visuales">Relatos Visuales</NuxtLink>

        <ul class="opciones">
          <li v-for="(relato, i) in relatos" :key="`relato${i}`" class="enlace-menu">
            <NuxtLink :to="`/archivo/relatos-visuales/${relato.slug}`">{{ relato.nombre }}</NuxtLink>
          </li>
        </ul>
      </div>

      <div class="opcion">
        <NuxtLink class="seccion" to="/archivo/rostros">Rostros</NuxtLink>

        <ul class="opciones">
          <li v-for="(rostro, i) in rostros" :key="`relato${i}`" class="enlace-menu">
            <NuxtLink :to="`/archivo/rostros/${rostro.slug}`">{{ rostro.nombre }}</NuxtLink>
          </li>
        </ul>
      </div>

      <div class="opcion">
        <NuxtLink class="seccion" to="/archivo/tecnicas">Técnicas</NuxtLink>

        <ul class="opciones">
          <li v-for="(tecnica, i) in tecnicas" :key="`tecnica${i}`" class="enlace-menu">
            <NuxtLink :to="`/archivo/tecnicas/${tecnica.slug}`">{{ tecnica.nombre }}</NuxtLink>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<style lang="scss" scoped>
#contenedorBuscador {
  background-color: $mediana;
  border-right: 2px solid $dolor;
  position: fixed;
  overflow: auto;
  width: 15vw;
  height: 100vh;
}

.logo-texto {
  margin: 1vw;
  font-family: $fuentePrincipal;
  overflow: hidden;
}

li {
  margin-bottom: 0.2em;
}

.opcionesBuscador {
  padding-left: 1em;
  margin-top: 1em;
}

.opcion {
  height: 1em;
  margin-top: 0.4em;
  overflow: hidden;
  &.abierto {
    height: fit-content;
  }
}

ul {
  margin-right: 0.2em;
  margin-left: 0.8em;
  padding-top: 0.5em;
  font-family: $fuenteMenu;
  font-size: 0.9em;
}

.seccion {
  font-family: $fuentePrincipal;
  font-size: 0.9em;
  cursor: pointer;
  overflow: hidden;
}

.iniciales {
  // height: auto;
  font-size: 1em;
  display: flex;
}

.inicial {
  cursor: pointer;
  padding: 0.3em;

  &.activo {
    font-weight: bold;
  }
}

.enlace-menu {
  margin-bottom: 0.4em;
  position: relative;

  &::before {
    content: '';
    width: 3px;
    height: 3px;
    border-radius: 50%;
    display: block;
    background-color: $dolor;
    position: absolute;
    left: -9px;
    top: 0.5em;
  }
}

.cat {
  width: auto;
  overflow: hidden;
  margin-bottom: 0.2em;
  &.cerrado {
    height: 1.2em;
  }
  &.categoriaLarga {
    height: 3em;
  }
  &.categoria5 {
    height: fit-content;
  }
}

.activo,
.router-link-exact-active {
  font-weight: bold;
}
</style>
