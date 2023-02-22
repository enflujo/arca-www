# Sitio principal de ARCA

![Estilos Código](https://github.com/enflujo/arca-www/actions/workflows/estilo-codigo.yml/badge.svg)
![Despliegue](https://github.com/enflujo/arca-www/actions/workflows/despliegue.yml/badge.svg)

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

## Despliegue al servidor

Github Actions se encarga de actualizar el código y reiniciar el servidor cuando se actualiza este repositorio.

Para saltarse el despliegue, incluir en el mensaje `[skip ci]`.
