import {useUserStore} from "~/stores/user";
import {User} from "~/interface";
import {ofetch} from "ofetch";
import useStatefulCookie from "~/composables/useStatefulCookie";

export default defineNuxtPlugin(async (NuxtApp) => {
  const config = useRuntimeConfig()
  const cookieToken = useStatefulCookie('auth.token')
  const cookieTokenRefresh = useStatefulCookie('auth.token_refresh')
  const userStore = useUserStore()

  const touch = ofetch.create({
    baseURL: config.public.apiBase,
    headers: {
      "Accept": 'application/json',
      "Content-Type": 'application/json'
    }
  })

  async function refreshToken() {
    const res = await touch('/auth/token/refresh', {
      method: 'POST',
      body: {
        refresh: cookieTokenRefresh.value
      }
    }).catch(() => null)
    if (res) {
      cookieToken.value = res.access
      return true
    }
    return false
  }

  async function fetchUser() {
    return await touch<User>('/auth/user', {
      headers: {
        "Authorization": `Bearer ${cookieToken.value}`
      }
    }).catch(() => null)
  }

  function clearToken() {
    cookieTokenRefresh.value = ''
    cookieToken.value = ''
  }

  async function authenticate() {
    if (userStore.logged.id) return null
    if (cookieToken.value) {
      let userRes = await fetchUser()
      if (!userRes && cookieTokenRefresh.value && await refreshToken()) {
        userRes = await fetchUser()
      }
      if (userRes) {
        userStore.setLogged(userRes)
        return userRes
      }
    }
    clearToken()
    return null
  }

  async function login(username: string, password: string) {
    let response = await touch<{ access: string, refresh: string } | null>('/auth/login', {
      method: "POST",
      body: {
        username,
        password
      }
    }).catch(() => null)
    if (response) {
      cookieTokenRefresh.value = response.refresh
      cookieToken.value = response.access
      userStore.setLogged(await fetchUser() || {} as User)
      await useRouter().push('/')
    }
  }

  async function register(username: string, password: string, email: string) {
    let response = await touch<{ access: string, refresh: string } | null>('/auth/user', {
      method: "POST",
      body: {
        username,
        password,
        email
      }
    }).catch(() => null)
    if (response) {

    }
  }

  async function forgot(email: string) {
    let response = await touch<{ access: string, refresh: string } | null>('/auth/forgot', {
      method: "POST",
      body: {
        email
      }
    }).catch(() => null)
    if (response) {

    }
  }

  async function logout() {
    await touch('/auth/logout', {
      method: "DELETE",
      headers: {"Authorization": `Bearer ${cookieToken.value}`}
    })
    cookieToken.value = ''
    cookieTokenRefresh.value = ''
    userStore.setLogged({} as User)
    await useRouter().push('/hello#bye')
  }

  return {
    provide: {
      authenticate,
      login,
      register,
      forgot,
      logout
    }
  }
})
