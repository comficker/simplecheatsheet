import {ofetch} from "ofetch";
import useStatefulCookie from "~/composables/useStatefulCookie";

export default defineNuxtPlugin(async (NuxtApp) => {
  const config = useRuntimeConfig()
  const cookieToken = useStatefulCookie('auth.token')
  const touch = ofetch.create({
    baseURL: config.public.apiBase,
    headers: {
      "Accept": 'application/json',
      "Content-Type": 'application/json',
      ...cookieToken.value ? { Authorization: `Bearer ${cookieToken.value}` } : {}
    }
  })

  return {
    provide: {
      touch
    }
  }
})
