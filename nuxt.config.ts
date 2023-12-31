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
  // @ts-ignore
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
        { rel: 'apple-touch-icon', href: '/images/icon-512.jpg' },
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
        {src: 'https://www.googletagmanager.com/gtag/js?id=G-SG8JNET42C', async: true},
        {
          hid: 'gtmHead',
          innerHTML: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-SG8JNET42C');
  `,
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
    directiveOnly: false
  },

  sourcemap: {
    server: true,
    client: true,
  },

  devtools: {
    enabled: true
  }
})
