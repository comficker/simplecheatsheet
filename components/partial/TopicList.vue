<script setup lang="ts">
import type {ResponseTopic} from "~/interface";
import {useUserStore} from "#imports";
import * as constants from "~/constants";

const route = useRoute()
const us = useUserStore()
const config = useRuntimeConfig()
const {data: response} = await useAuthFetch<ResponseTopic>('/cs/topics/', {
  params: {
    page_size: 500,
    'taxonomies__id_string': route.params.id_string
  },
  key: route.params.id_string?.toString() || 'list'
})

useHead({
  title: response.value?.instance ? `${response.value?.instance?.name} Cheatsheets` : constants.appName
})

us.setBC(response.value?.instance ? [{
  name: response.value?.instance?.name,
  current: true,
  href: `/category/${response.value?.instance?.id_string}`
}] : [])

const meta = computed(() => ({
  title: response.value?.instance ? `${response.value?.instance?.name} Cheatsheets` : constants.appName,
  desc: response.value?.instance?.desc || constants.appDescription
}))

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
    },
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://simplecheatsheet.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": meta.value.title,
            "item": `https://simplecheatsheet.com/category/${response.value?.instance?.id_string}`
          }
        ]
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
</script>

<template>
  <div>
    <div v-if="response.instance" class="inline-flex lg:max-w-1/2">
      <div class="p-4 bg-gradient-to-r from-indigo-50">
        <div class="flex gap-4">
          <div v-if="response.instance.media" class="flex-none">
            <img
              class="w-16"
              :src="config.public.apiBase + response.instance.media.sizes.thumb_128"
              :alt="response.instance.name"
            >
          </div>
          <div class="flex-1">
            <h1 class="font-semibold text-2xl md:text-4xl">{{ response.instance.name }} CheatSheets</h1>
            <p>{{ response.instance.desc }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="grid p-4 gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      <nuxt-link
        v-for="item in response.results" :key="item.id_string"
        :to="`/${item.id_string}`"
        class="flex gap-3 shadow bg-white p-3"
      >
        <div v-if="item.media" class="flex-none">
          <img
            class="w-16"
            :src="config.public.apiBase + item.media.sizes.thumb_128"
            :alt="item.name"
          >
        </div>
        <div class="flex-1">
          <div class="text-base font-bold">{{ item.name }}</div>
          <div class="line-clamp-3">
            <p>{{ item.desc }}</p>
          </div>
        </div>
      </nuxt-link>
    </div>
  </div>
</template>

