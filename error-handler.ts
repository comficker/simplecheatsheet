import {useRouter} from "#app";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = async (error, instance, info) => {
    window.location.reload()
  }
})
