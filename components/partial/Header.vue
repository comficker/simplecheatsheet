<script setup lang="ts">
import {useUserStore} from "~/stores/user";
import {useClickOutSite} from "#imports";
import {Menu, MenuButton, MenuItem, MenuItems} from "@headlessui/vue";
import {BellIcon} from "@heroicons/vue/24/outline";
import {ChevronDownIcon, ChevronRightIcon, HomeIcon} from "@heroicons/vue/20/solid";

const {$logout} = useNuxtApp()
const route = useRoute()
const userStore = useUserStore()
const pages = computed(() => userStore.breadcrumbs)
const user = computed(() => {
  return userStore.isLogged ? {
    full_name: userStore.logged.first_name ? `${userStore.logged.first_name} ${userStore.logged.last_name}` : userStore.logged.username,
    username: userStore.logged.username
  } : {
    full_name: "Guess",
    username: "Guess"
  }
})

const userNavigation = [
  {name: 'Your profile', href: '#'},
  {name: 'Sign out', href: '#'},
]

const componentRef = ref()
const showMenu = ref(false)

useClickOutSite(componentRef, () => {
  showMenu.value = false
})
</script>
<template>
  <div class="flex flex-1 gap-x-4 self-stretch justify-between">
    <nav class="flex" aria-label="Breadcrumb">
      <ol role="list" class="flex items-center space-x-4">
        <li>
          <nuxt-link to="/" class="text-gray-400 hover:text-gray-500">
            <HomeIcon class="h-5 w-5 flex-shrink-0" aria-hidden="true"/>
            <span class="sr-only">Home</span>
          </nuxt-link>
        </li>
        <li v-for="page in pages" :key="page.name">
          <nuxt-link :to="page.href" class="flex items-center">
            <ChevronRightIcon class="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true"/>
            <span class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">{{ page.name }}</span>
          </nuxt-link>
        </li>
      </ol>
    </nav>
    <div class="flex items-center gap-x-4 lg:gap-x-6">
      <helper-status-select class="hidden md:block"/>
      <nuxt-link
        v-if="userStore.isLogged" to="/submit"
        class="flex gap-2 items-center p-2.5 text-gray-400 hover:text-gray-500"
      >
        <div class="h-6 w-6 i-con-plus"/>
        <span>Submit</span>
      </nuxt-link>
      <div class="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true"/>
      <Menu as="div" class="relative">
        <MenuButton class="-m-1.5 flex items-center p-1.5">
          <span class="sr-only">Open user menu</span>
          <img
            class="h-8 w-8 rounded-full bg-gray-50"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
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
            class="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
            <MenuItem v-for="item in userNavigation" :key="item.name" v-slot="{ active }">
              <a
                :href="item.href"
                :class="[active ? 'bg-gray-50' : '', 'block px-3 py-1 text-sm leading-6 text-gray-900']">
                {{ item.name }}
              </a>
            </MenuItem>
          </MenuItems>
        </transition>
      </Menu>
    </div>
  </div>
</template>
