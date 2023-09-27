import { defineStore } from 'pinia';
import type { Imagen, Pagina, PaginaArchivo, RegistroObra } from '~/tipos';
import { gql } from '~/utilidades/ayudas';

export type ColecionRelacionada = { campo: string; coleccionRelacionada: string };
export type Campo = { titulo: string; campo: keyof RegistroObra & 'separador' };

export type CerebroGeneral = {
  datosCargados: boolean;
  paginas: Pagina[];
  paginasArchivo: PaginaArchivo[];
  filtro: string;
  titulo: string;
  banner?: Imagen;
  descripcion: string;
  guardaescobas: string;
  buscadorVisible: boolean;
  busquedaActual: string;
  relaciones: ColecionRelacionada[];
  campos: Campo[];
  llaveBuscador: string | null;
};

export const usarGeneral = defineStore('general', {
  state: () =>
    ({
      datosCargados: false,
      paginas: [],
      paginasArchivo: [],
      filtro: '',
      titulo: '',
      descripcion: '',
      guardaescobas: '',
      buscadorVisible: false,
      busquedaActual: '',
      relaciones: [],
      campos: [],
      llaveBuscador: null,
    }) as CerebroGeneral,

  actions: {
    async cargarGeneral() {
      const General = gql`
        query {
          general {
            nombre
            descripcion
            banner {
              id
              title
            }
            texto_footer
          }

          paginas(filter: { estado: { _eq: "publicado" } }, sort: ["sort"]) {
            titulo
            slug
          }

          paginas_archivo(filter: { estado: { _eq: "publicado" } }, sort: ["sort"]) {
            titulo
            titulo_singular
            slug
            mostrar_en_menu
            coleccion
          }
        }
      `;

      const { general, paginas, paginas_archivo } = await obtenerDatos('general', General);

      this.paginas = paginas;
      this.paginasArchivo = paginas_archivo;
      this.titulo = general.nombre || 'Arca';
      this.banner = general.banner;
      this.descripcion = general.descripcion || '';
      this.guardaescobas = general.texto_footer || '';
      this.datosCargados = true;
    },

    async cargarRelaciones() {
      const Relaciones = gql`
        query {
          relations_in_collection(collection: "obras") {
            field
            related_collection
          }
        }
      `;

      const { relations_in_collection } = await obtenerDatos('relaciones', Relaciones, true);

      this.relaciones = relations_in_collection.map((relacion: { related_collection: string; field: string }) => {
        return { coleccionRelacionada: relacion.related_collection, campo: relacion.field };
      });
    },

    async cargarCampos() {
      const CamposObraIndividual = gql`
        query {
          general {
            campos
          }
        }
      `;
      const { general } = await obtenerDatos('camposObraIndividual', CamposObraIndividual);

      if (general && general.campos) {
        this.campos = general.campos;
      }
    },
  },
});
