<script setup lang="ts">
import {defineComponent, h} from 'vue'
import type {ResponseTopic} from "~/interface";
import * as pkg from "lodash";

const {debounce} = pkg

const props = defineProps<{
  error: {
    url: string
    statusCode: number
    statusMessage: string
    message: string
    description: string
    data: any
  }
}>()

const social = [
  {
    name: 'Twitter',
    href: '#',
    icon: defineComponent({
      render: () =>
        h('svg', {fill: 'currentColor', viewBox: '0 0 24 24'}, [
          h('path', {
            d: 'M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84',
          }),
        ]),
    }),
  },
  {
    name: 'GitHub',
    href: '#',
    icon: defineComponent({
      render: () =>
        h('svg', {fill: 'currentColor', viewBox: '0 0 24 24'}, [
          h('path', {
            'fill-rule': 'evenodd',
            d: 'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z',
            'clip-rule': 'evenodd',
          }),
        ]),
    }),
  }
]

useHead({
  title: "Sorry!!!, we could’t find the page you’re looking for."
})

const search = ref('')
const doSearch = ref(false)
const {data: response} = await useAuthFetch<ResponseTopic>('/cs/topics/', {
  params: {
    page_size: 5,
    search: search
  },
  key: "3",
  watch: [doSearch]
})

watch(search, debounce(() => {
  doSearch.value = !doSearch.value
}, 800))
</script>

<template>
  <div class="bg-white h-screen flex flex-col">
    <main class="flex-1 mx-auto w-full max-w-7xl px-6 pb-16 pt-10 sm:pb-24 lg:px-8">
      <img
        class="mx-auto h-8 w-auto" src="/logo.png"
        alt=""
      />
      <div class="mx-auto mt-20 max-w-2xl text-center sm:mt-24">
        <p class="font-bold text-8xl italic text-gray-400">404</p>
        <p class="mt-4 text-base leading-7 text-gray-600 sm:mt-6 sm:text-lg sm:leading-8">Sorry, we could’t find the
          page you’re looking for.
        </p>
      </div>
      <div class="mx-auto mt-4 flow-root max-w-lg">
        <h2 class="sr-only">Popular pages</h2>
        <div
          class="mx-auto max-w-xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
          <div class="relative">
            <svg class="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400" viewBox="0 0 20 20"
                 fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd"
                    d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                    clip-rule="evenodd"/>
            </svg>
            <input
              v-model="search"
              type="text"
              class="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
              placeholder="Search..." role="combobox" aria-expanded="false" aria-controls="options"
            >
          </div>
          <ul class="max-h-96 transform-gpu scroll-py-3 overflow-y-auto no-scrollbar p-3 text-sm" role="listbox">
            <li v-for="item in response.results" :key="item.id">
              <nuxt-link :to="`/${item.id_string}`" class="group flex rounded-xl p-3">
                <div class="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-indigo-500">
                  <svg
                    class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                    aria-hidden="true">
                    <path
                      stroke-linecap="round" stroke-linejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/>
                  </svg>
                </div>
                <div class="ml-4 flex-auto">
                  <p class="font-semibold">{{ item.name }}</p>
                  <p class=" text-gray-500">{{ item.desc }}</p>
                </div>
              </nuxt-link>
            </li>
          </ul>
        </div>
        <div class="mt-10 flex justify-center">
          <nuxt-link to="/" class="text-sm font-semibold leading-6 text-indigo-600">
            <span aria-hidden="true">&larr;</span>
            Back to home
          </nuxt-link>
        </div>
      </div>
    </main>
    <footer class="border-t border-gray-100 py-6 sm:py-10">
      <div class="mx-auto flex max-w-7xl flex-col items-center justify-center gap-8 px-6 sm:flex-row lg:px-8">
        <p class="text-sm leading-7 text-gray-400">&copy; SimpleCheatSheet.com. All rights reserved.</p>
        <div class="hidden sm:block sm:h-7 sm:w-px sm:flex-none sm:bg-gray-200"/>
        <div class="flex gap-x-4">
          <a v-for="(item, itemIdx) in social" :key="itemIdx" :href="item.href"
             class="text-gray-400 hover:text-gray-500">
            <span class="sr-only">{{ item.name }}</span>
            <component :is="item.icon" class="h-6 w-6" aria-hidden="true"/>
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>
