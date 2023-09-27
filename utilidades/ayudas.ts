import type { Categoria, ImagenArca, Obra, ObraGaleria } from '~/tipos';
import { apiBase } from '../config/general';

/**
 * Ayuda a construir la URL para pedir un archivo al API de Directus.
 * https://docs.directus.io/reference/api/assets/#requesting-a-thumbnail
 *
 * Para ver las opciones que se pueden pasar al solicitar la imagen:
 * https://docs.directus.io/reference/files.html#preset-transformations
 *
 * @example
 * ```js
 * // Ejemplo con parámetros:
 * urlImagen(id, {quality: 85, format: webp});
 * ```
 *
 * @param id El ID del archivo o imagen en Directus
 * @param {string|object} key El nombre del key u Objeto con parámetros
 * @returns {string} URL con el endpoint desde donde se puede pedir el archivo
 */
export const urlImagen = (id: number, key: string): string => {
  if (!id) {
    throw new Error(`Se tiene que usar un ID del archivo pero ahora el parámetro es ${JSON.stringify(id)}`);
  }

  if (key) {
    // Desde Directus se pueden crear configuraciones predeterminadas para pedir imágenes en diferentes formatos usando un "key"
    // Si se usa un key, podemos devolver este endpoint sencillo
    if (typeof key === 'string') {
      return `${apiBase}/assets/${id}?key=${key}`;
    }

    // Si no se usa un key sino que se pasan las opciones manualmente, debemos construir la URL con sus parámetros.
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
export const eliminarTildes = (texto: string) => {
  return texto.normalize('NFD').replace(/\p{Diacritic}/gu, '');
};

/**
 * Ayuda a extraer la primera letra de un texto omitiendo tildes.
 *
 * @param {string} texto Texto del cual extraer la primera letra
 * @returns Primera letra del texto sin tilde.
 */
export const extraerPrimeraLetra = (texto: string) => {
  return eliminarTildes(texto.trim().charAt(0));
};

export const gql = String.raw;

export function ordenarPorNombre(lista: { nombre: string }[]) {
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

export function aplanarCategorias(datosCategoria: Categoria, siguienteCategoria: number) {
  type Respuesta = {
    nombre: string;
    slug: string;
    numObras: number;
    ancestro: number | null;
    id: number;
    [siguienteNivel: string]: any;
  };
  const respuesta: Respuesta = {
    nombre: datosCategoria.nombre,
    slug: datosCategoria.slug,
    numObras: datosCategoria.obras_func.count,
    ancestro: datosCategoria.ancestro ? datosCategoria.ancestro.id : null,
    id: datosCategoria.id,
  };

  if (siguienteCategoria <= 6) {
    const siguienteNivel = `categorias${siguienteCategoria}`;

    if (datosCategoria[siguienteNivel] && datosCategoria[siguienteNivel].length) {
      const nivel = siguienteCategoria + 1;
      respuesta[siguienteNivel] = datosCategoria[siguienteNivel].map((categoria: Categoria) => {
        return aplanarCategorias(categoria, nivel);
      });
    }
  }

  return respuesta;
}

/**
 *
 * @param {string} nombre Nombre de la variable en css, por ejemplo '--verdeEsmeralda'
 */
export function obtenerVariablesCSS(nombre: string): string {
  const ele = window.getComputedStyle(document.body, '');
  return ele.getPropertyValue(nombre);
}

export const esperar = (funcion: (evento: any) => void, tiempoEspera: number) => {
  let temporizador: number | null = null;

  return (evento: any) => {
    if (temporizador) window.clearTimeout(temporizador);

    temporizador = window.setTimeout(() => {
      funcion(evento);
    }, tiempoEspera);
  };
};

export const demorar = (funcion: (evento: any) => void, esperar: number) => {
  let temporizador: number | null = null;
  let anterior = 0;

  return (evento: any) => {
    const ahora = Date.now();
    const restante = esperar - (ahora - anterior);

    if (restante <= 0 || restante > esperar) {
      if (temporizador) {
        clearTimeout(temporizador);
        temporizador = null;
      }
      anterior = ahora;
      funcion(evento);
    }
  };
};

export function definirDimsImagen(obra: Obra): ObraGaleria | undefined {
  if (!obra.imagen) return;
  if (!obra.imagen.width && !obra.imagen.height) return;
  const ancho = Math.round((obra.imagen.width / obra.imagen.height) * 200);
  const alto = 200;
  Object.assign(obra.imagen, { ancho, alto });

  return obra as ObraGaleria;
}
