<script setup lang="ts">
import {useUserStore} from "~/stores/user";
import {useClickOutSite} from "#imports";
import {Menu, MenuButton, MenuItem, MenuItems} from "@headlessui/vue";
import {BellIcon} from "@heroicons/vue/24/outline";
import {ChevronDownIcon, ChevronRightIcon, HomeIcon} from "@heroicons/vue/20/solid";

const {$logout} = useNuxtApp()
const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const pages = computed(() => userStore.breadcrumbs)
const user = computed(() => {
  return userStore.isLogged ? {
    full_name: userStore.logged.first_name ? `${userStore.logged.first_name} ${userStore.logged.last_name}` : userStore.logged.username,
    username: userStore.logged.username,
    avatar: userStore.logged.avatar ? config.public.apiBase + userStore.logged.avatar : '/favicon.png'
  } : {
    full_name: "Guess",
    username: "Guess",
    avatar: '/favicon.png'
  }
})

const userNavigation = [
  {logged: true, name: 'Your profile', func: () => router.replace(`/profile/${user.value.username}`)},
  {logged: true, name: 'Sign out', func: () => $logout()},
  {logged: false, name: 'Login', func: () => router.replace('/hello')},
  {logged: false, name: 'Register', func: () => router.replace('/hello#register')},
]

const componentRef = ref()
const showMenu = ref(false)

useClickOutSite(componentRef, () => {
  showMenu.value = false
})

useHead({
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": pages.value.map(x => ({
          "@type": "ListItem",
          "position": 1,
          "name": x.name,
          "item": `https://simplecheatsheet.com${x.href}`
        }))
      })
    },
  ]
})

</script>
<template>
  <div class="w-full flex flex-1 gap-x-4 self-stretch justify-between">
    <nav class="flex-1 flex overflow-auto no-scrollbar" aria-label="Breadcrumb">
      <client-only>
        <ol role="list" class="flex items-center space-x-4 flex-nowrap">
          <li class="flex-none">
            <nuxt-link to="/" class="text-gray-400 hover:text-gray-500">
              <HomeIcon class="h-5 w-5 flex-shrink-0" aria-hidden="true"/>
              <span class="sr-only">Home</span>
            </nuxt-link>
          </li>
          <li class="flex-none" v-for="page in pages" :key="page.name">
            <nuxt-link :to="page.href" class="flex items-center">
              <ChevronRightIcon class="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true"/>
              <span class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">{{ page.name }}</span>
            </nuxt-link>
          </li>
        </ol>
      </client-only>
    </nav>
    <div class="flex-none flex items-center gap-x-4 lg:gap-x-6">
      <helper-status-select class="hidden md:block"/>
      <nuxt-link
        v-if="userStore.isLogged" to="/submit"
        class="flex gap-2 items-center p-2.5 text-gray-400 hover:text-gray-500"
      >
        <div class="h-6 w-6 i-con-plus"/>
        <span class="hidden md:block">Submit</span>
      </nuxt-link>
      <div class="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true"/>
      <Menu as="div" class="relative">
        <MenuButton class="-m-1.5 flex items-center p-1.5">
          <span class="sr-only">Open user menu</span>
          <img
            class="h-8 w-8 rounded-full bg-gray-50"
            :src="user.avatar"
            alt=""
          />
          <span
            class="hidden lg:flex lg:items-center"
          >
            <span
              class="ml-4 text-sm font-semibold leading-6 text-gray-900"
              aria-hidden="true"
            >{{ user.full_name }}</span>
            <ChevronDownIcon class="ml-2 h-5 w-5 text-gray-400" aria-hidden="true"/>
          </span>
        </MenuButton>
        <transition
          enter-active-class="transition ease-out duration-100"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95">
          <MenuItems
            class="absolute right-0 z-10 mt-2.5 w-48 origin-top-right rounded bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
            <MenuItem v-for="item in userNavigation.filter(x => x.logged == userStore.isLogged)" :key="item.name"
                      v-slot="{ active }">
              <a
                @click="item.func"
                :class="[active ? 'bg-gray-50' : '', 'cursor-pointer block px-3 py-1 text-sm leading-6 text-gray-900']">
                {{ item.name }}
              </a>
            </MenuItem>
          </MenuItems>
        </transition>
      </Menu>
    </div>
  </div>
</template>
