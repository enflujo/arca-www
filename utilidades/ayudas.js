import { apiBase, urlBase, nombre } from '../config/general';

/**
 * Ayuda a construir la URL para pedir un archivo al API de Directus.
 * https://docs.directus.io/reference/api/assets/#requesting-a-thumbnail
 *
 * @param {number} id El ID del archivo o imagen en Directus
 * @param {string|object} key El nombre del key u Objejo con parametros
 * @returns {string} URL con el endpoint desde donde se puede pedir el archivo
 */
export const urlImagen = (id, key) => {
  if (!id) {
    throw new Error(`Se tiene que usar un ID del archivo pero ahora el parámetro es ${JSON.stringify(id)}`);
  }

  if (key) {
    // Desde Directus se pueden crear configuraciones predeterminadas para pedir imagenes en diferentes formatos usando un "key"
    // Si se usa un key, podemos devolver este endpoint sencillo
    if (typeof key === 'string') {
      return `${apiBase}/assets/${id}?key=${key}`;
    }

    // Si no se usa un key sino que se pasan las opciones manualmente, debemos construir la URL con sus parametros.
    const query = new URLSearchParams(key).toString();
    return `${apiBase}/assets/${id}?${query}`;
  }

  return `${apiBase}/assets/${id}`;
};

/**
 * Elimina las tildes de todo el texto.
 *
 * @param {string} texto Texto sobre el cual eliminar las tildes
 * @returns Texto sin tildes.
 */
export const eliminarTildes = (texto) => {
  return texto.normalize('NFD').replace(/\p{Diacritic}/gu, '');
};

/**
 * Ayuda a extraer la primera letra de un texto omitiendo tildes.
 *
 * @param {string} texto Texto del cual extraer la primera letra
 * @returns Primera letra del texto sin tilde.
 */
export const extraerPrimeraLetra = (texto) => {
  return eliminarTildes(texto.trim().charAt(0));
};

export const gql = String.raw;

// export const obtenerDatos = async (query) => {
//   const peticion = await fetch(`${apiBase}/graphql`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ query }),
//   }).then((respuesta) => respuesta.json());

//   if (peticion.errors) {
//     throw new Error(JSON.stringify(peticion.errors, null, 2));
//   }

//   return peticion.data;
// };

export function ordenarPorNombre(lista) {
  lista.sort((a, b) => {
    const nombreA = a.nombre.toUpperCase(); // ignorar mayúsculas y minúsculas
    const nombreB = b.nombre.toUpperCase();
    if (nombreA < nombreB) {
      return -1;
    }
    if (nombreA > nombreB) {
      return 1;
    }

    return 0;
  });
}
