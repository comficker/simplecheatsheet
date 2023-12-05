import {UseFetchOptions, useFetch} from '#app'
import {defu} from 'defu'
import useStatefulCookie from "~/composables/useStatefulCookie";

export function useAuthFetch<T>(url: string, options: UseFetchOptions<T> = {}) {
  const userAuth = useStatefulCookie('auth.token')
  const config = useRuntimeConfig()
  const defaults: UseFetchOptions<T> = {
    baseURL: config.public.apiBase,
    key: url,
    headers: {
      ...userAuth.value
        ? {Authorization: `Bearer ${userAuth.value}`}
        : {},
      "Content-Type": 'application/json',
      "Accept": 'application/json; indent=2'
    }
  }

  const params = defu(options, defaults)

  return useFetch(url, params)
}
