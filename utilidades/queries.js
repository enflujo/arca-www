import { gql } from './ayudas';
import { usarArchivo } from '~~/cerebros/archivo';

const cerebroArchivo = usarArchivo();

/**
 * Datos básicos para cargar página con campo `nombre` rápidamente.
 *
 * @param {string} coleccion Nombre de la colección.
 * @param {string} slug Slug de la entrada.
 * @returns
 */
export const nombrePorSlug = (coleccion, slug) => {
  return gql`
  query {
    ${coleccion}(filter: { slug: { _eq: "${slug}" } }, limit: 1) {
      id
      nombre
      obras_func {
        count
      }
    }
  }
  `;
};

/**
 * Obras para galería.
 *
 * @param {string} coleccion Nombre de la colección.
 * @param {string} slug Slug de la entrada.
 * @param {boolean} m2m  ¿Es de una relación M2M?
 * @returns
 */
export const obrasPorSlug = (coleccion, slug, m2m = false, pagina = 1) => {
  return gql`
  query {
    ${coleccion}(filter: { slug: { _eq: "${slug}" } }, limit: 1) {
      obras(limit: ${cerebroArchivo.obrasPorPagina}, page: ${pagina}) {
        ${m2m ? 'obras_id {' : ''}
        id
        registro
        titulo
        imagen {
          id,
          title
        }
        autores {
          autores_id {
            id
            nombre
            apellido
          }
        }
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
