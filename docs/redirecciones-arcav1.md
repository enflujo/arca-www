# Redirecciones desde la versión anterior (arcav1)

Google todavía tiene indexadas las fichas e imágenes de `arcav1.uniandes.edu.co`, que hoy responden con error 500.
Quien busca una pintura por su nombre encuentra la imagen y llega a un enlace roto.

Con redirecciones permanentes (301), Google reemplaza en sus resultados las URL viejas por las nuevas y
la gente llega a la ficha correcta de ARCA.

**El número de obra de la versión anterior es el mismo `registro` de la actual**
(verificado con copias del Internet Archive: 10742 «Virgen de Sabaya», 13231 «De Español y Castiza, Español»,
1486 «Niño de la espina»).

| URL vieja                                                                            | URL nueva                                         |
| ------------------------------------------------------------------------------------ | ------------------------------------------------- |
| `https://arcav1.uniandes.edu.co/artworks/10742`                                      | `https://arca.uniandes.edu.co/obras/10742`        |
| `https://arcav1.uniandes.edu.co/system/artworks/avatars/000/010/742/large/10742.jpg` | `https://arca.uniandes.edu.co/obras/10742/imagen` |
| cualquier otra (`/artworks`, `/artworks?topic=6`, …)                                 | `https://arca.uniandes.edu.co/`                   |

`/obras/{registro}/imagen` redirige a su vez a la imagen de la obra (`/imagenes/obra/{id}/{titulo}.webp`).

## Opción A (recomendada): apuntar el dominio al sitio nuevo

El sitio nuevo ya trae estas reglas (`server/middleware/redirecciones-arcav1.ts`). Basta con que
`arcav1.uniandes.edu.co` llegue al mismo servidor que `arca.uniandes.edu.co` (DNS o proxy), conservando
la cabecera `Host`. No hay que mantener el servidor viejo.

## Opción B: configurar el servidor viejo

### nginx

```nginx
server {
  server_name arcav1.uniandes.edu.co;

  location ~ ^/artworks/(\d+)/?$ {
    return 301 https://arca.uniandes.edu.co/obras/$1;
  }

  location ~* ^/system/artworks/avatars/.*/(\d+)\.(jpe?g|png|gif|webp)$ {
    return 301 https://arca.uniandes.edu.co/obras/$1/imagen;
  }

  location / {
    return 301 https://arca.uniandes.edu.co/;
  }
}
```

### Apache (.htaccess)

```apache
RewriteEngine On
RewriteRule ^artworks/(\d+)/?$ https://arca.uniandes.edu.co/obras/$1 [R=301,L]
RewriteRule ^system/artworks/avatars/.*/(\d+)\.(jpe?g|png|gif|webp)$ https://arca.uniandes.edu.co/obras/$1/imagen [R=301,L,NC]
RewriteRule ^ https://arca.uniandes.edu.co/ [R=301,L]
```

## Después de activarlas

En Google Search Console (propiedad de `arca.uniandes.edu.co`):

1. Enviar `https://arca.uniandes.edu.co/sitemap.xml`.
2. Si `arcav1.uniandes.edu.co` está verificado, usar **Cambio de dirección** hacia `arca.uniandes.edu.co`.
3. Revisar en «Páginas» y «Imágenes» cómo se reindexa.

## Imágenes del API

`apiarca.uniandes.edu.co/robots.txt` bloquea todo (`Disallow: /`), por eso Google no puede indexar las imágenes
servidas desde el API. El sitio ahora las sirve desde su propio dominio en `/imagenes/...`. Si se prefiere
abrir también el API, en Directus se puede definir la variable `ROBOTS_TXT` para permitir `/assets/`.
