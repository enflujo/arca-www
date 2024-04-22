<script setup lang="ts">
import type { AutorProcesado, EntradaColeccion, Gesto, PaginaArchivo, PersonajeProcesado } from '~/tipos';

interface Props {
  coleccion: string;
  datos: AutorProcesado | PersonajeProcesado | PaginaArchivo | Gesto | EntradaColeccion;
}

defineProps<Props>();
</script>

<template>
  <div id="informacion">
    <template v-if="coleccion === 'pagina'">
      <section v-if="(datos as PaginaArchivo).contenido" class="seccion">
        <div v-html="(datos as PaginaArchivo).contenido" class="infoContenido"></div>
      </section>
    </template>

    <template v-else-if="coleccion === 'personajes'">
      <section v-if="(datos as PersonajeProcesado).muerte" class="seccion medio">
        <h2>Muerte</h2>
        <div class="infoContenido">
          <p>{{ (datos as PersonajeProcesado).muerte }} {{ (datos as PersonajeProcesado).muerte_anotacion }}</p>
        </div>
      </section>

      <section v-if="(datos as PersonajeProcesado).fechas.length" class="seccion medio">
        <h2>Beatificación / Canonización</h2>
        <div class="infoContenido">
          <p>{{ (datos as PersonajeProcesado).fechas.join(' - ') }}</p>
        </div>
      </section>

      <section v-if="(datos as PersonajeProcesado).descripcion" class="seccion">
        <h2>Descripción</h2>
        <div v-html="(datos as PersonajeProcesado).descripcion" class="infoContenido"></div>
      </section>

      <section v-if="(datos as PersonajeProcesado).fuente" class="seccion">
        <h2>Fuente</h2>
        <div v-html="(datos as PersonajeProcesado).fuente" class="infoContenido"></div>
      </section>
    </template>

    <template v-else-if="coleccion === 'autores'">
      <section v-if="(datos as AutorProcesado).fechas.length" class="seccion medio">
        <h2>Actividad</h2>
        <div class="infoContenido">
          <p>{{ (datos as AutorProcesado).fechas.join(' - ') }}</p>
        </div>
      </section>

      <section v-if="(datos as AutorProcesado).biografia" class="seccion">
        <h2>Biografía</h2>
        <div v-html="(datos as AutorProcesado).biografia" class="infoContenido"></div>
      </section>

      <section v-if="(datos as AutorProcesado).referencia" class="seccion">
        <h2>Referencia</h2>
        <div v-html="(datos as AutorProcesado).referencia" class="infoContenido"></div>
      </section>
    </template>

    <template v-else-if="coleccion === 'gestos'">
      <section v-if="(datos as Gesto).codigo" class="seccion medio">
        <h2>Código</h2>
        <div class="infoContenido">
          <p>{{ (datos as Gesto).codigo }}</p>
        </div>
      </section>

      <section v-if="(datos as Gesto).descripcion" class="seccion">
        <h2>Descripción</h2>
        <div v-html="(datos as Gesto).descripcion" class="infoContenido"></div>
      </section>
    </template>

    <template v-else>
      <section v-if="(datos as EntradaColeccion).descripcion" class="seccion">
        <h2>Descripción</h2>
        <div v-html="(datos as EntradaColeccion).descripcion" class="infoContenido"></div>
      </section>
    </template>
  </div>
</template>

<style lang="scss" scoped>
#informacion {
  font-weight: bold;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.seccion {
  font-family: var(--fuenteParrafos);

  padding: 0.5em 0;
  border-top: 2px solid $dolor;
  width: 100%;
  display: flex;
  flex-basis: 100%;
  align-items: center;

  &:last-child {
    border-bottom: 2px solid $dolor;
    margin-bottom: 1em;
  }

  h2 {
    font-weight: bold;
    font-size: 1em;
    width: 130px;
    color: $dolor;
  }

  &.medio {
    vertical-align: top;
    flex-basis: 48%;
  }
}

.infoContenido {
  margin-left: 0.5em;
  flex: 1;
  font-size: 0.9em;
}
</style>
