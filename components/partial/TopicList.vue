<script setup lang="ts">
import type {ResponseTopic} from "~/interface";
import {useUserStore} from "#imports";
import * as constants from "~/constants";

const route = useRoute()
const us = useUserStore()
const config = useRuntimeConfig()
const params = computed(() => ({
  page_size: 24,
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
            <h1 class="font-semibold text-2xl md:text-4xl">{{ meta.title }}</h1>
            <div>{{ response.instance.desc }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="md:flex flex-col md:flex-row md:divide-x divide-gray-100">
      <div class="flex-1 grid p-4 gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        <nuxt-link
          v-for="item in response.results" :key="item.id_string"
          :to="`/${item.id_string}`"
          class="flex gap-3 ring ring-gray-100 rounded bg-white p-3"
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
              <div v-html="item.desc"></div>
            </div>
          </div>
        </nuxt-link>
      </div>
      <div class="md:w-96 space-y-4 p-4">
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
</template>

