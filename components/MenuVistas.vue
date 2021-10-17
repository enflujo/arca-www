<template>
  <div class="barra-detalles">
    <div class="cambio-vista">
      <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29">
        <g id="Group_595" data-name="Group 595" transform="translate(-1853 -447)">
          <g id="Group_585" data-name="Group 585" transform="translate(1853.472 447)">
            <path
              id="Ellipse_57"
              data-name="Ellipse 57"
              d="M14.5,2A12.5,12.5,0,0,0,5.661,23.339,12.5,12.5,0,0,0,23.339,5.661,12.418,12.418,0,0,0,14.5,2m0-2A14.5,14.5,0,1,1,0,14.5,14.5,14.5,0,0,1,14.5,0Z"
              transform="translate(-0.472 0)"
              fill="#af2828"
            />
          </g>
          <g id="Group_586" data-name="Group 586" transform="translate(20 10)">
            <rect
              id="Rectangle_139"
              data-name="Rectangle 139"
              width="5"
              height="5"
              transform="translate(1842 446)"
              fill="#af2828"
            />
            <rect
              id="Rectangle_141"
              data-name="Rectangle 141"
              width="5"
              height="5"
              transform="translate(1842 452)"
              fill="#af2828"
            />
            <rect
              id="Rectangle_140"
              data-name="Rectangle 140"
              width="5"
              height="5"
              transform="translate(1848 446)"
              fill="#af2828"
            />
            <rect
              id="Rectangle_142"
              data-name="Rectangle 142"
              width="5"
              height="5"
              transform="translate(1848 452)"
              fill="#af2828"
            />
          </g>
        </g>
      </svg>
      <input id="switch" type="checkbox" /><label for="switch">Toggle</label>
      <svg xmlns="http://www.w3.org/2000/svg" width="24.393" height="24.403" viewBox="0 0 24.393 24.403">
        <g id="Group_581" data-name="Group 581" transform="translate(0 0)">
          <path
            id="Path_1123"
            data-name="Path 1123"
            d="M79.785,134.263A12.216,12.216,0,0,0,90.793,116.8c-.012-.033-.026-.065-.041-.1s-.025-.045-.038-.067a12.2,12.2,0,1,0-10.93,17.63ZM88.191,116.7,80.9,120.254v-8.124a9.9,9.9,0,0,1,7.287,4.573Zm-9.525-4.572v9.915a1.12,1.12,0,0,0,1.61,1.006l8.893-4.335a9.952,9.952,0,1,1-10.5-6.586Z"
            transform="translate(-67.587 -109.859)"
            fill="#c6c6c6"
          />
        </g>
      </svg>
    </div>
    <!-- <div class="descripcion-categoria">
      <h3>{{ busqueda }}</h3>

      <p class="descripcion">{{ descripcion }}</p>
    </div>
    <Mapa :datos="obras" /> -->
  </div>
</template>

<script>
export default {
  props: {
    busqueda: {
      type: String,
      default: '',
    },

    descripcion: {
      type: String,
      default: '',
    },

    obras: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style lang="scss" scoped>
.barra-detalles {
  display: flex;
  flex-direction: column;
  width: 5%;
  justify-content: space-around;
  align-content: center;
}
.cambio-vista {
  height: 150px;
  justify-content: space-around;
  align-items: center;
  display: flex;
  flex-direction: column;
}
.descripcion {
  margin-top: 10px;
}
.descripcion-categoria {
  background-color: $dolor;
  width: 350px;
  height: 200px;
  color: $claridad;
  padding: 10px;
  position: relative;
}
input[type='checkbox'] {
  height: 0;
  width: 0;
  visibility: hidden;
  position: absolute;
  top: 0;
  left: 0;
}
label {
  cursor: pointer;
  text-indent: -9999px;
  width: 50px;
  height: 30px;
  border: 2px solid $dolor;
  background: transparent !important;
  display: block;
  border-radius: 100px;
  position: relative;
  transform: rotate(90deg);
}
label:after {
  content: '';
  position: absolute;
  top: 5px;
  left: 5px;
  width: 15px;
  height: 15px;
  border: 2px solid $dolor;
  border-radius: 90px;
  transition: 0.3s;
}
input:checked + label {
  background: transparent;
}
input:checked + label:after {
  left: calc(100% - 5px);
  transform: translateX(-100%);
}
label:active:after {
  width: 15px;
}
.Group_581 {
  display: flex;
}
</style>
