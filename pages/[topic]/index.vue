<script setup lang="ts">
import type {ResponsePost, Post} from "~/interface";
import {useUserStore} from "#imports";
import * as constants from "~/constants"

const route = useRoute()
const us = useUserStore()
const config = useRuntimeConfig()
const params = computed(() => ({
  "topic__id_string": route.params.topic,
  "page_size": 100
}))
const {data: response} = await useAuthFetch<ResponsePost>(`/cs/posts/`, {
  params: params
}).catch(() => {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Found'
  })
})

const sections = computed<Post[]>(() => {
  if (response.value) {
    return response.value.results.filter((x: Post) => !x.parent)
  }
  return []
})

function chunk(arr: any[], chunkSize: number) {
  if (chunkSize <= 0) return []
  const R: any[][] = [];
  let i = 0;
  arr.forEach(item => {
    if (!R[i]) R[i] = [];
    R[i].push(item)
    if (i < chunkSize) i++;
    if (i == chunkSize) i = 0;
  })
  return R;
}

const section_posts = computed<Post[][][]>(() => {
  if (response.value) {
    return sections.value.map(x => {
      const posts = response.value?.results.filter((p: Post) => p.parent == x.id) || []
      return chunk(posts, 3)
    })
  }
  return []
})

us.setBC(response.value?.instance ? [{
  name: response.value?.instance?.name,
  current: true,
  href: `/${response.value?.instance?.id_string}`
}] : [])

useHead({
  title: `${response.value?.instance.name} Cheatsheet`,
  meta: [
    {name: 'description', content: response.value?.instance.desc}
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
            "name": `${response.value?.instance.name} Cheatsheet`,
            "item": `https://simplecheatsheet.com/${response.value?.instance?.id_string}`
          }
        ]
      })
    },
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org/",
        "@type": "AggregateRating",
        "itemReviewed": {
          "@type": "Restaurant",
          "image": "https://www.example.com/seafood-restaurant.jpg",
          "name": "Legal Seafood",
          "servesCuisine": "Seafood",
          "telephone": "1234567",
          "address" : {
            "@type": "PostalAddress",
            "streetAddress": "123 William St",
            "addressLocality": "New York",
            "addressRegion": "NY",
            "postalCode": "10038",
            "addressCountry": "US"
          }
        },
        "ratingValue": "88",
        "bestRating": "100",
        "ratingCount": "20"
      })
    }
  ]
})

useSeoMeta({
  title: `${response.value?.instance.name} Cheatsheet`,
  ogTitle: `${response.value?.instance.name} Cheatsheet`,
  description: response.value?.instance.desc,
  ogDescription: response.value?.instance.desc,
  ogImage: '/default.png',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div class="px-4 space-y-4">
    <div class="inline-flex lg:max-w-1/2">
      <div class="-ml-4 p-4 bg-gradient-to-r from-indigo-50">
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
            <p class="">{{ response.instance.desc }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col md:flex-row gap-6">
      <div class="flex-1 space-y-6">
        <div v-for="(posts, i) in section_posts" :key="i" class="scroll-50 space-y-3" :id="sections[i].id_string">
          <h2 class="inline-flex font-bold py-1 p-2 bg-gradient-to-r from-indigo-50">
            {{ sections[i].name }}
          </h2>
          <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            <partial-card-sheet v-if="sections[i].text" class="mb-4" content-only :sheet="sections[i]"/>
            <div class="w-full overflow-hidden" v-for="chunk in posts">
              <partial-card-sheet class="mb-4" v-for="item in chunk" :key="item.id" :sheet="item"/>
            </div>
          </div>
        </div>
      </div>
      <div class="md:w-1/4 lg:w-1/5 bg-white space-y-4 text-sm py-4">
        <div class="sticky top-32 right-0">
          <h4 class="text-base font-bold">Table of contents</h4>
          <ul class="divide-y divide-dashed space-y-2">
            <li v-for="(item, i) in sections" :key="item.id">
              <a class="pt-2 flex" :href="`#${item.id_string}`">
                <div class="w-5">{{ i + 1 }}</div>
                <div>{{ item.name }}</div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.scroll-50 {
  scroll-margin-top: 114px;
}
</style>
