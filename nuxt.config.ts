export default defineNuxtConfig({
  modules: ['@pinia/nuxt', '@nuxt/devtools'],
  pages: true,

  app: {
    head: {
      htmlAttrs: {
        lang: 'es',
      },
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', href: '/arca-icono.svg', type: 'image/svg+xml' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/sitio.webmanifest' },
        { rel: 'canonical', href: 'https://arca.uniandes.edu.co' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=Nunito:wght@700;800&family=Unbounded:wght@500&display=swap',
          crossorigin: '',
        },
      ],
      script: [
        {
          async: true,
          defer: true,
          src: 'https://analiticaarca.uniandes.edu.co/script.js',
          'data-website-id': 'bc6c51bf-8938-47db-9a3a-228fa9d14ff3',
          'data-domains': 'arca.uniandes.edu.co',
        },
      ],
    },
  },

  dir: {
    pages: 'paginas',
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/scss/_general.scss" as *;',
        },
      },
    },
  },

  typescript: {
    shim: false,
  },

  build: {
    transpile: ['@enflujo/alquimia'],
  },

  compatibilityDate: '2024-09-06',
});
