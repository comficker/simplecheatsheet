<script setup lang="ts">
import type {ResponseTopic} from "~/interface";
import {useUserStore} from "#imports";
import * as constants from "~/constants";

const route = useRoute()
const us = useUserStore()
const config = useRuntimeConfig()
const page = computed(() => route.query.page ? Number.parseInt(route.query.page.toString()) : 1)
const params = computed(() => ({
  page: page.value,
  page_size: 32,
  'taxonomies__id_string': route.params.id_string,
  db_status__in: us.topicStatus.join(",")
}))

const {data: response} = await useAuthFetch<ResponseTopic>('/cs/topics/', {
  params: params,
  key: route.params.id_string?.toString() || 'list',
  watch: [params]
})

const meta = computed(() => ({
  title: response.value?.instance ?
    `${capitalizeFirstLetter(response.value?.instance?.type)}: ${response.value?.instance?.name.replace("Cheat Sheet", "")} Cheatsheets` : constants.appName,
  desc: response.value?.instance?.desc || constants.appDescription
}))

const pages = computed(() => {
  const totalPage = response.value?.num_pages || 0
  const out = []
  let left = page.value - 1 > 4 ? page.value - 3 : page.value - 1
  let right = totalPage - page.value > 4 ? page.value + 3 : totalPage - 1
  for (let i = page.value - 1; i >= left; i--) {
    if (i >= 1) {
      out.unshift(i)
    }
  }
  out.push(page.value)
  for (let i = page.value + 1; i <= right; i++) {
    if (i <= totalPage) out.push(i)
  }
  return out
})

us.setBC(response.value?.instance ? [{
  name: response.value?.instance?.name,
  current: true,
  href: `/category/${response.value?.instance?.id_string}`
}] : [])

useHead({
  title: meta.value.title,
  meta: [
    {name: 'description', content: meta.value.desc}
  ],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "url": "https://simplecheatsheet.com",
        "logo": "https://simplecheatsheet.com/favicon.png",
        "description": constants.appDescription,
        "name": constants.appName,
        "contactPoint": {
          "contactType": "customer support",
          "email": "comficker@gmail.com"
        }
      })
    }
  ]
})

useSeoMeta({
  title: meta.value.title,
  ogTitle: meta.value.title,
  description: meta.value.desc,
  ogDescription: meta.value.desc,
  ogImage: '/default.png',
  twitterCard: 'summary_large_image',
})

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
</script>

<template>
  <div>
    <div v-if="response.instance" class="border-b border-gray-100">
      <div class="g:max-w-1/2 p-4 bg-gradient-to-r from-indigo-50">
        <div class="flex gap-4">
          <div v-if="response.instance.media" class="flex-none">
            <img
              class="w-16"
              :src="config.public.apiBase + response.instance.media.sizes.thumb_128"
              :alt="response.instance.name"
            >
          </div>
          <div class="flex-1">
            <h1 class="font-semibold text-2xl md:text-4xl">{{ meta.title }}</h1>
            <div>{{ response.instance.desc }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="md:flex flex-col md:flex-row md:divide-x divide-gray-100">
      <div class="flex-1">
        <div class="min-h-screen">
          <div class="overflow-auto grid p-4 gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
            <nuxt-link
              v-for="item in response.results" :key="item.id_string"
              :to="`/${item.id_string}`"
              class="ring ring-gray-100 rounded bg-white p-3"
            >
              <div class="flex-1">
                <div class="flex gap-2">
                  <div v-if="item.media" class="flex-none">
                    <img
                      class="w-5"
                      :src="config.public.apiBase + item.media.sizes.thumb_24"
                      :alt="item.name"
                    >
                  </div>
                  <div class="text-base font-bold">{{ item.name }}</div>
                </div>
                <div class="line-clamp-2 text-gray-500">
                  <div v-html="item.desc"></div>
                </div>
              </div>
            </nuxt-link>
          </div>
        </div>
        <nav class="border-t border-gray-100 bg-white z-10 sticky bottom-0 flex items-center justify-between p-4">
          <div class="-mt-px flex w-0 flex-1">
            <nuxt-link
              v-if="page > 1"
              :to="`?page=${page - 1}`"
              class="inline-flex items-center pr-1 text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              <div class="i-con-arrow-left mr-3 h-5 w-5" aria-hidden="true"/>
              <span>Previous</span>
            </nuxt-link>
          </div>
          <div class="-mt-px md:flex">
            <nuxt-link
              v-for="p in pages"
              :to="`?page=${p}`"
              class="inline-flex items-center px-4 text-sm font-medium text-gray-500 hover:text-gray-700"
              :class="{'opacity-30': params.page === p}"
            >{{ p }}</nuxt-link>
          </div>
          <div class="-mt-px flex w-0 flex-1 justify-end">
            <nuxt-link
              v-if="page < response.num_pages"
              :to="`?page=${page + 1}`"
              class="inline-flex items-center pl-1 text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              <span>Next</span>
              <div class="i-con-arrow-right ml-3 h-5 w-5" aria-hidden="true"/>
            </nuxt-link>
          </div>
        </nav>
      </div>
      <div class="md:w-96">
        <div class="space-y-4 p-4 md:sticky top-25">
          <div class="ring ring-gray-100 rounded bg-white p-3 space-y-3">
            <h3 class="font-medium">Leaderboard</h3>
            <partial-leaderboard/>
          </div>
          <div class="ring ring-gray-100 rounded bg-white p-3 space-y-3">
            <h3 class="font-medium">Activity</h3>
            <partial-feed/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

