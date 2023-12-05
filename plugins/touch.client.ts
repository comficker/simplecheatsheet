import Vue3TouchEvents from "vue3-touch-events";

export default defineNuxtPlugin(nuxtApp => {
  return {
    provide: {
      Vue3TouchEvents,
    }
  }
})
