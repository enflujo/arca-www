import type { ImagenArca } from '~/tipos';

export interface BaseRegistro {
  obras: {
    titulo: string;
    imagen: ImagenArca;
  }[];
}
