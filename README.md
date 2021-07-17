# Sitio principal del Laboratorio EnFlujo

![CI workflow](https://github.com/enflujo/enflujo-www/actions/workflows/ci.yml/badge.svg)

Creado con [Nuxt.js](https://nuxtjs.org) (Vue con _Server-Side-Rendering_)

## Instalación

```bash
# Instalar dependencias
yarn install
```

## Desarrollo local

```bash
yarn dev
```

Inicia un servidor local (con hot-reloading) en [localhost:3000](http://localhost:3000)

## Construir para producción

```bash
# Exportar app
yarn build

# Iniciar en modo de producción
yarn start
```

## Aplicar reglas de estilo al código

Para ver los errores de estilo:

```bash
yarn lint
```

**¡IMPORTANTE!** - Antes de hacer push o PR, aplicar las reglas al código:

```bash
yarn lint:fix
```

## Sobre Vue

```js
data() {
  return  {
    variable1: false,
    variable2: true
  }
}

this.variable1
this.variable2
this.variable3

computed: {
  variable3() {
    return this.$store....
  }
}
```

```js
<template>

<template>

<script>
// En Footer
props: {
  algo: {
    type: Number
  }
}

watch: {
  algo() {
    hagaAlgo();
    otraCosaExclusivaDeJS();
  }
}


</script>
```

```js
//Componente en Vue (puede ser de la carpeta componentes, pero tambien los layouts y pages). En resumen, todos los archivos .vue son componentes.
<Componente prop1="hola" />
<Pagina :propVariable="algoDeDatos" />
<Layout>
  <OtroComponente>
</Layout>
```

<<<<<<< HEAD

#### Store

```js
const state = {
  x: null,
};
const actions = {
  hola({ commit, state }, datos) {
    //...
    commit('mutarEstadoX', datosConvertidosEnAccion);
  },
};
const mutations = {
  mutarEstadoX(state, datos) {
    this.state.x = datos;
  },
};
```

```js
store.dispatch('[nombreDelStore]/[nombreDeAccion]', datos);
store.commit('[nombreDelStore]/[nombreDeMutacion]', datos);
```

=======

> > > > > > > e859fcb (💩)
