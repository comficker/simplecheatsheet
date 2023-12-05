import {useUserStore} from "~/stores/user";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const us = useUserStore()
  if (!us.isLogged) {
    const {$authenticate} = useNuxtApp()
    // @ts-ignore
    await $authenticate()
  }
})
