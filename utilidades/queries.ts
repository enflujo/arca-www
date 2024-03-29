import { gql } from './ayudas';
import { usarArchivo } from '~/cerebros/archivo';

const coleccionesSinDescripcion = ['paises', 'ciudades', 'ubicaciones'];
/**
 * Datos básicos de una colección.
 *
 * @param {string} coleccion Nombre de la colección.
 * @param {string} busqueda Slug o ID de la entrada.
 * @returns
 */
export const datosGeneralesColeccion = (coleccion: string, busqueda: string, porId: boolean) => {
  if (coleccion === 'personajes') {
    return gql`
    query {
      personajes(filter: { slug: {_eq: "${busqueda}"} }) {
        id
        nombre
        descripcion
        fuente
        muerte
        muerte_anotacion
        beatificacion_canonizacion_desde
        beatificacion_canonizacion_desde_anotacion
        beatificacion_canonizacion_hasta
        beatificacion_canonizacion_hasta_anotacion
        obras_func {
          count
        }
      }
    }
    `;
  } else if (coleccion === 'autores') {
    return gql`
    query {
      autores(filter: { id: {_eq: ${busqueda} } }, limit: 1)  {
        id
        nombre
        apellido
        biografia
        referencia
        desde
        desde_anotacion
        hasta
        hasta_anotacion
        obras_func {
          count
        }
      }
    }
    `;
  } else if (coleccion === 'gestos') {
    return gql`
    query {
      gestos(filter: { slug: {_eq: "${busqueda}" } }, limit: 1)  {
        slug
        nombre
        codigo
        obras_gesto_1_func {count}
        obras_gesto_2_func {count}
        obras_gesto_3_func {count}
      }
    }
    `;
  }

  return gql`
  query {
    ${coleccion}(filter: { ${porId ? 'id' : 'slug'}: { _eq: "${busqueda}" } }, limit: 1) {
      id
      nombre
      ${!coleccionesSinDescripcion.includes(coleccion) ? 'descripcion' : ''}
      ${coleccion === 'gestos' ? 'codigo' : ''}
      obras_func {
        count
      }
    }
  }
  `;
};

const camposObrasGaleria = () => {
  return `
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
  `;
};

const paises = () => {
  return `
  paises(filter: { obras_func: { count: { _neq: 0 } } }, limit: -1) {
    id
    nombre
    slug
    geo
    obras_func {
      count
    }
  }`;
};

/**
 * Obras para galería.
 *
 * @param {string} coleccion Nombre de la colección.
 * @param {string} busqueda Slug o ID de la entrada.
 * @param {boolean} m2m  ¿Es de una relación M2M?
 * @returns
 */
export const datosObrasGaleria = (
  coleccion: string,
  nombreCampo = coleccion,
  busqueda: string,
  m2m: boolean = false,
  pagina = 1,
  porId = false,
  numObras?: number
) => {
  const cerebroArchivo = usarArchivo();
  const numeroObras = numObras || cerebroArchivo.obrasPorPagina;
  if (m2m) {
    return gql`query {
      obras_${coleccion}(filter: {${nombreCampo || coleccion}_id: {${
        porId ? 'id' : 'slug'
      }: {_eq: "${busqueda}"}}}, limit: ${numeroObras}, page: ${pagina}) {
        obras_id {
          ${camposObrasGaleria()}
        }
      }
    }
    `;
  }

  return gql`query {
    obras(filter: {${nombreCampo}: {${
      porId ? 'id' : 'slug'
    }: { _eq: "${busqueda}" }}}, limit: ${numeroObras}, page: ${pagina}) {
    ${camposObrasGaleria()}
    }
  }`;
};

export const indiceColeccion = (coleccion: string) => {
  if (coleccion === 'ubicaciones') {
    return gql`
      query {
        ${paises()}

        ubicaciones(limit: -1) {
          id
          nombre
          geo
          obras_func {
            count
          }
        }
      }
    `;
  } else if (coleccion === 'paises') {
    return gql`
    query {
      ${paises()}
    }
    `;
  } else if (coleccion === 'autores') {
    return gql`
      query {
        autores(limit: -1, sort: ["apellido"]) {
          id
          nombre
          apellido
          obras_func {
            count
          }
        }
      }
    `;
  } else if (coleccion === 'ciudades') {
    return gql`
      query {
        ciudades(sort: ["nombre"], limit: -1) {
          nombre
          id
          obras_func {
            count
          }
        }
      }
    `;
  } else if (coleccion === 'gestos') {
    return gql`
      query {
        gestos(sort: ["nombre"], limit: -1) {
          nombre
          slug
          obras_gesto_1_func {
            count
          }
          obras_gesto_2_func {
            count
          }
          obras_gesto_3_func {
            count
          }
        }
      }
    `;
  }

  return gql`
  query {
    ${coleccion}(sort: ["nombre"], limit: -1) {
      nombre
      slug
      obras_func {
        count
      }
    }
  }
  `;
};
