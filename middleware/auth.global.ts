import {useUserStore} from "~/stores/user";
import {navigateTo} from "#app";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (to.name?.toString() === 'topic') {
    const redirects: {[key: string]: string[]} = {
      laravel: [
        "/laravel-artisan/",
        "/laravel-auth-cheat-sheet/",
        "/laravel-blade/",
        "/laravel-cookie/",
        "/laravel-db-cheat-sheet/",
        "/laravel-validation/",
      ],
      powershell: [
        "/powershell-regular-expressions/"
      ],
      pl_sql: [
        "/pl-sql-cursors/",
        "/pl-sql-date-time/",
        "/pl-sql-exceptions/",
        "/pl-sql-triggers/"
      ],
      svelte: [
        '/svelte-store-cheat-sheet/'
      ]
    }
    let redirect;
    for (let i = 0; i < Object.keys(redirects).length; i++) {
      const key = Object.keys(redirects)[i]
      if (redirects[key].indexOf(to.path.toString()) >= 0) {
        redirect = `/${key.replace("_", "-")}`
        break;
      }
    }
    if (redirect && redirect != to.path)
      return navigateTo(redirect);
  }
  const us = useUserStore()
  if (!us.isLogged) {
    const {$authenticate} = useNuxtApp()
    // @ts-ignore
    await $authenticate()
  }
})
