<template>
  <main>
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog as="div" class="relative z-50 lg:hidden" @close="sidebarOpen = false">
        <TransitionChild
          as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0"
          enter-to="opacity-100" leave="transition-opacity ease-linear duration-300"
          leave-from="opacity-100" leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-900/80"/>
        </TransitionChild>
        <div class="fixed inset-0 flex">
          <TransitionChild
            as="template" enter="transition ease-in-out duration-300 transform"
            enter-from="-translate-x-full" enter-to="translate-x-0"
            leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0"
            leave-to="-translate-x-full">
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
              <TransitionChild
                as="template" enter="ease-in-out duration-300" enter-from="opacity-0"
                enter-to="opacity-100" leave="ease-in-out duration-300" leave-from="opacity-100"
                leave-to="opacity-0">
                <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button type="button" class="-m-2.5 p-2.5" @click="sidebarOpen = false">
                    <span class="sr-only">Close sidebar</span>
                    <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true"/>
                  </button>
                </div>
              </TransitionChild>
              <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                <nuxt-link to="/" class="flex h-16 shrink-0 items-center">
                  <img
                    class="w-3/4" src="/logo.png"
                    alt="Simple Cheat Sheet"
                  />
                </nuxt-link>
                <nav class="flex flex-1 flex-col">
                  <ul role="list" class="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" class="-mx-2 space-y-1">
                        <li v-for="item in category.results" :key="item.name">
                          <nuxt-link
                            :to="`/category/${item.id_string}`"
                            :class="[item.current ? 'bg-gray-50 text-indigo-600' : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50', 'group flex gap-x-3 rounded-md p-2 leading-6 font-semibold']"
                          >
                            <div v-if="item.media" class="flex-none">
                              <img :src="config.public.apiBase + item.media.sizes.thumb_24" :alt="item.name"
                                   class="w-4">
                            </div>
                            <span class="flex-1">{{ item.name }}</span>
                          </nuxt-link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>
    <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-56 lg:flex-col">
      <div class="flex grow flex-col border-r border-gray-100 overflow-y-auto bg-white">
        <nuxt-link to="/" class="px-4 flex h-12 border-b border-gray-100 shrink-0 items-center">
          <img
            class="w-full" src="/logo.png"
            alt="Simple CheatSheet"
          />
        </nuxt-link>
        <nav class="p-4 flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col gap-y-4">
            <li>
              <ul role="list" class="-mx-2 space-y-1 font-medium">
                <li v-for="item in category.results" :key="item.name">
                  <nuxt-link
                    :to="`/category/${item.id_string}`"
                    :class="[item.current ? 'bg-gray-50 text-indigo-600' : 'hover:text-indigo-600 hover:bg-gray-50', 'group flex gap-2 p-2']"
                  >
                    <div v-if="item.media" class="flex-none">
                      <img :src="config.public.apiBase + item.media.sizes.thumb_24" :alt="item.name" class="w-4">
                    </div>
                    <span class="flex-1">{{ item.name }}</span>
                  </nuxt-link>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
    <div class="lg:pl-56">
      <div
        class="sticky top-0 z-40 flex h-12 shrink-0 items-center gap-x-4 border-b border-gray-100 bg-white px-4 sm:gap-x-4"
      >
        <button type="button" class="-m-2.5 p-2.5 text-gray-700 lg:hidden" @click="sidebarOpen = true">
          <span class="sr-only">Open sidebar</span>
          <Bars3Icon class="h-6 w-6" aria-hidden="true"/>
        </button>
        <div class="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true"/>
        <partial-header/>
      </div>
      <main>
        <div class="sticky z-40 top-12 left-0 bg-white w-full border-b border-gray-100">
          <div class="flex flex-nowrap items-center gap-3 font-medium">
            <div class="max-w-44">
              <form class="relative bg-white p-4">
                <label for="search-field" class="sr-only">Search</label>
                <MagnifyingGlassIcon
                  class="pointer-events-none absolute inset-y-0 left-3 h-full w-5 text-gray-400"
                  aria-hidden="true"/>
                <input
                  v-model="search"
                  id="search-field"
                  class="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0"
                  placeholder="Search..." type="search" name="search"
                />
              </form>
            </div>
            <div class="flex-1 overflow-auto no-scrollbar">
              <div class="flex flex-nowrap">
                <nuxt-link
                  v-for="item in response.results" :key="item.id_string"
                  :to="`/${item.id_string}`"
                  class="flex-none block p-3 py-1.5 rounded-[2px] flex gap-2 items-center"
                >
                  <img
                    class="w-4" v-if="item.media" :src="config.public.apiBase + item.media.sizes.thumb_24"
                    :alt="item.name">
                  <div>{{ item.name }}</div>
                </nuxt-link>
              </div>
            </div>
          </div>
        </div>
        <div class="flex-1">
          <slot/>
        </div>
      </main>
    </div>
  </main>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import type {ResponseTaxonomy, ResponseTopic} from "~/interface";

import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import {
  XMarkIcon, Bars3Icon, MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'
import pkg from "lodash";

const {debounce} = pkg
const sidebarOpen = ref(false)
const search = ref('')
const doSearch = ref(false)
const config = useRuntimeConfig()
const route = useRoute()

const [{data: category}, {data: response}] = await Promise.all([
  useAuthFetch<ResponseTaxonomy>('/cs/taxonomies/?type=category'),
  useAuthFetch<ResponseTopic>('/cs/topics/', {
    params: {
      page_size: 5,
      search: search
    },
    key: "3",
    watch: [doSearch]
  })
])

watch(search, debounce(() => {
  doSearch.value = !doSearch.value
}, 800))

watch(() => route.path, () => {
  sidebarOpen.value = false
})
</script>
