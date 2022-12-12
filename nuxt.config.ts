import { defineNuxtConfig } from 'nuxt/config';
import { apiBase } from './config/general';

const isDev = process.env.NODE_ENV === 'development';

const server = {
  host: isDev ? 'localhost' : '0.0.0.0',
  port: isDev ? 3000 : 4043,
};

export default defineNuxtConfig({
  modules: ['nuxt-graphql-client', '@pinia/nuxt'],
  runtimeConfig: {
    public: {
      GQL_HOST: `${apiBase}/graphql`,
    },
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
});
