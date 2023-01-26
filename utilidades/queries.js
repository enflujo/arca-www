import { gql } from './ayudas';

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
export const obrasPorSlug = (coleccion, slug, m2m = false) => {
  return gql`
  query {
    ${coleccion}(filter: { slug: { _eq: "${slug}" } }, limit: 1) {
      obras(limit: 50) {
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
