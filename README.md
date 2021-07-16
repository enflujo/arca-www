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
