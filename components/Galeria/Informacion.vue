<script setup lang="ts">
defineProps({
  coleccion: String,
  datos: Object,
});
</script>

<template>
  <div id="informacion">
    <template v-if="coleccion === 'pagina'">
      <section v-if="datos.contenido" class="seccion">
        <div v-html="datos.contenido" class="infoContenido"></div>
      </section>
    </template>

    <template v-else-if="coleccion === 'personajes'">
      <section v-if="datos.muerte" class="seccion medio">
        <h2>Muerte</h2>
        <div class="infoContenido">
          <p>{{ datos.muerte }} {{ datos.muerte_anotacion }}</p>
        </div>
      </section>

      <section v-if="datos.fechas.length" class="seccion medio">
        <h2>Beatificación / Canonización</h2>
        <div class="infoContenido">
          <p>{{ datos.fechas.join(' - ') }}</p>
        </div>
      </section>

      <section v-if="datos.descripcion" class="seccion">
        <h2>Descripción</h2>
        <div v-html="datos.descripcion" class="infoContenido"></div>
      </section>

      <section v-if="datos.fuente" class="seccion">
        <h2>Fuente</h2>
        <div v-html="datos.fuente" class="infoContenido"></div>
      </section>
    </template>

    <template v-else-if="coleccion === 'autores'">
      <section v-if="datos.fechas.length" class="seccion medio">
        <h2>Actividad</h2>
        <div class="infoContenido">
          <p>{{ datos.fechas.join(' - ') }}</p>
        </div>
      </section>

      <section v-if="datos.biografia" class="seccion">
        <h2>Biografía</h2>
        <div v-html="datos.biografia" class="infoContenido"></div>
      </section>

      <section v-if="datos.referencia" class="seccion">
        <h2>Referencia</h2>
        <div v-html="datos.referencia" class="infoContenido"></div>
      </section>
    </template>

    <template v-else-if="coleccion === 'gestos'">
      <section v-if="datos.codigo" class="seccion medio">
        <h2>Código</h2>
        <div class="infoContenido">
          <p>{{ datos.codigo }}</p>
        </div>
      </section>

      <section v-if="datos.descripcion" class="seccion">
        <h2>Descripción</h2>
        <div v-html="datos.descripcion" class="infoContenido"></div>
      </section>
    </template>

    <template v-else>
      <section v-if="datos.descripcion" class="seccion">
        <h2>Descripción</h2>
        <div v-html="datos.descripcion" class="infoContenido"></div>
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
  margin: 0.5em 0;
  padding: 0.5em 0;
  border-top: 2px solid $dolor;
  width: 100%;
  display: flex;
  flex-basis: 100%;

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
  padding-top: 0.1em;
  flex: 1;
  font-size: 0.9em;
}
</style>
