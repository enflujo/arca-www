import { gql } from './ayudas';
import { usarArchivo } from '~~/cerebros/archivo';

const cerebroArchivo = usarArchivo();

/**
 * Datos básicos de una colección.
 *
 * @param {string} coleccion Nombre de la colección.
 * @param {string} busqueda Slug o ID de la entrada.
 * @returns
 */
export const datosGeneralesColeccion = (coleccion, busqueda) => {
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
      autores_by_id(id: ${busqueda}) {
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
  }

  return gql`
  query {
    ${coleccion}(filter: { slug: { _eq: "${busqueda}" } }, limit: 1) {
      id
      nombre
      descripcion
      ${coleccion === 'gestos' ? 'codigo' : ''}
      obras_func {
        count
      }
    }
  }
  `;
};

const camposAutores = () => {
  return `autores {
    autores_id {
      id
      nombre
      apellido
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
export const datosObras = (coleccion, busqueda, m2m = false, pagina = 1) => {
  if (coleccion === 'autores') {
    return gql`
    query {
      autores_by_id(id: ${busqueda}) {
        obras(limit: ${cerebroArchivo.obrasPorPagina}, page: ${pagina}) {
          obras_id {
            registro
            titulo
            imagen {
              id,
              title
              width
              height
            }
            ${camposAutores()}
          }
        }
      }
    }
    `;
  }

  return gql`
  query {
    ${coleccion}(filter: { slug: { _eq: "${busqueda}" } }, limit: 1) {
      obras(limit: ${cerebroArchivo.obrasPorPagina}, page: ${pagina}) {
        ${m2m ? 'obras_id {' : ''}
        registro
        titulo
        imagen {
          id,
          title
          width
          height
        }
        ${camposAutores()}
        ${m2m ? '}' : ''}
      }
    }
  }
  `;
};

export const indiceColeccion = (coleccion) => {
  if (coleccion === 'paises') {
    return gql`
      query {
        paises(filter: { obras_func: { count: { _neq: 0 } } }, limit: -1) {
          id
          nombre
          slug
          geo
          obras(limit: -1) {
            id
          }
          obras_func {
            count
          }
        }

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
