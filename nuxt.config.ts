import { appDescription } from './constants'


export default defineNuxtConfig({
  // @ts-ignore
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    'nuxt-lazy-load',
    '@nuxtjs/partytown',
  ],

  experimental: {
    payloadExtraction: false,
    inlineSSRStyles: false,
    renderJsonPayloads: true,
  },

  css: [
    '~/assets/custom.css',
    '~/assets/font/inter.css',
    '@unocss/reset/tailwind.css',
  ],

  colorMode: {
    classSuffix: '',
  },

  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
  },

  app: {
    keepalive: true,
    head: {
      titleTemplate: '%s - simplecheatsheet.com',
      link: [
        { rel: 'icon', href: '/favicon.png', sizes: 'any' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/images.png' },
        {
          href: 'https://fonts.googleapis.com/css2?family=Karla:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;1,200;1,300;1,400;1,500;1,600&display=swap',
          rel: 'stylesheet'
        }
      ],
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=6.0, minimum-scale=1.0' },
        { name: 'description', content: appDescription },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-touch-fullscreen', content: 'yes' },
      ],
      script: [
        {
          hid: 'gtmHead',
          innerHTML: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-MKLR8GDG');`,
          //@ts-ignore
          body: true
        },
      ],
    },
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.API
    }
  },

  build: {
    transpile: ['tslib'],
  },

  lazyLoad: {
    images: true,
    videos: true,
    audios: true,
    iframes: true,
    native: false,
    directiveOnly: false,
    //@ts-ignore
    defaultImage: '/loading.svg',
  },

  sourcemap: {
    server: true,
    client: true,
  },

  devtools: {
    enabled: true
  }
})
