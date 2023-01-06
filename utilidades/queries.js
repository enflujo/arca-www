import { gql } from './ayudas';

/**
 * Crea el query para las páginas con galería.
 *
 * @param {string} coleccion Nombre de la colección.
 * @param {string} slug Slug de la entrada.
 * @param {boolean} m2m ¿Es de una relación M2M?
 * @returns
 */
export const buscarTermino = (coleccion, slug, m2m = false) => {
  return gql`
  query {
    ${coleccion}(filter: { slug: { _eq: "${slug}" } }, limit: 1) {
      nombre
      obras(limit: 5) {
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
