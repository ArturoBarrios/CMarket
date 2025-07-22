import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      capi: process.env.capi // maps your .env variable to public runtime config
    }
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  css: ['~/assets/css/main.css'],
  modules: [    
    '@nuxt/ui', 
    '@nuxt/test-utils',
    '@nuxt/image',     
    '@pinia/nuxt'
  ]
})