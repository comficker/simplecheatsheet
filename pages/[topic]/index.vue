<script setup lang="ts">
import type {ResponsePost, Post} from "~/interface";
import {useUserStore} from "#imports";
import * as constants from "~/constants"

const route = useRoute()
const us = useUserStore()
const config = useRuntimeConfig()
const params = computed(() => ({
  "topic__id_string": route.params.topic,
  "page_size": 100,
  db_status__in: us.topicStatus.join(",")
}))
const {data: response} = await useAuthFetch<ResponsePost>(`/cs/posts/`, {
  params: params,
  key: route.params.topic.toString()
}).catch(() => {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Found'
  })
})

const colum = computed(() => response.value?.instance?.meta?.layout || 3)
const hasChild = computed(() => !!response.value?.results.filter(x => !!x.parent).length)
const sections = computed<Post[]>(() => {
  if (response.value) {
    return response.value.results.filter((x: Post) => !x.parent).sort((a, b) => {
      const s = response.value?.instance?.meta?.sort || []
      return s.indexOf(a.id) - s.indexOf(b.id)
    })
  }
  return []
})

const section_posts = computed<Post[][]>(() => {
  if (response.value) {
    return sections.value.map(x => {
      const posts = response.value?.results.filter((p: Post) => p.parent == x.id) || []
      posts.sort((a, b) => {
        const s = x.meta?.sort || []
        return s.indexOf(a.id) - s.indexOf(b.id)
      })
      return posts
    })
  }
  return []
})

us.setBC([{
  name: response.value?.instance?.name || '',
  current: true,
  href: `/${response.value?.instance?.id_string}`
}])

useHead({
  title: `${response.value?.instance.name} Cheat sheet`,
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
        "@context": "https://schema.org/",
        "@type": "Book",
        "name": `${response.value?.instance.name} cheat sheet`,
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "88",
          "bestRating": "100",
          "ratingCount": "20"
        }
      })
    },
    {
      src: 'https://unpkg.com/masonry-layout@4/dist/masonry.pkgd.min.js'
    }
  ]
})

useSeoMeta({
  title: `${response.value?.instance.name} cheat sheet`,
  ogTitle: `${response.value?.instance.name} cheat sheet`,
  description: response.value?.instance.desc,
  ogDescription: response.value?.instance.desc,
  ogImage: '/default.png',
  twitterCard: 'summary_large_image',
})

const masonry = () => {
  if (window.innerWidth >= 728) {
    const elms = document.querySelectorAll('.masonry-sub')
    for (let i = 0; i< elms.length;i++) {
      new Masonry( elms[i]);
    }
    if (document.querySelector('.masonry')) {
      new Masonry('.masonry');
    }
  }
}

onMounted(() => {
  masonry()
})


</script>

<template>
  <div class="px-4 space-y-4">
    <div class="relative">
      <div class="inline-flex xl:max-w-1/2">
        <div class="-ml-4 p-4 bg-gradient-to-r from-indigo-50">
          <div class="flex-col md:flex-row flex gap-4">
            <div v-if="response.instance.media" class="flex-none">
              <img
                class="w-32 md:w-24"
                :src="config.public.apiBase + response.instance.media.sizes.thumb_128"
                :alt="response.instance.name"
              >
            </div>
            <div class="flex-1">
              <h1 class="font-semibold text-2xl md:text-4xl">{{ response.instance.name }} Cheat Sheet</h1>
              <p>{{ response.instance.desc }}</p>
              <div class="flex flex-wrap -mx-0.5">
                <div v-for="item in response.instance.taxonomies" :key="item.id" class="p-1">
                  <nuxt-link
                    class="p-0.5 px-2 rounded bg-gradient-to-r from-green-200"
                    :to="`/${item.type}/${item.id_string}`"
                  >{{item.name}}</nuxt-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="us.isLogged" class="absolute right-4 top-4">
        <nuxt-link
          :to="`/submit?id=${response.instance.id_string}`"
          class="block cursor-pointer p-2 border border-gray-100 rounded">
          <div class="w-4 h-4 i-con-pen"/>
        </nuxt-link>
      </div>
    </div>
    <div v-if="sections.length" class="flex w-full flex-col md:flex-row gap-6">
      <div
        class="flex-1 flex flex-wrap md:-mx-2 masonry"
      >
        <div
          v-for="(posts, i) in section_posts" :key="i" class="md:p-2 masonry-item w-full"
          :class="[hasChild ? '': `xl:w-1/${colum}`]"
        >
          <div class="scroll-50 space-y-3" :id="sections[i].id_string">
            <h2 class="inline-flex font-bold py-0 rounded p-2 bg-gradient-to-r from-indigo-50">
              <nuxt-link :to="`/${response.instance.id_string}/${sections[i].id_string}`">{{ sections[i].name }}</nuxt-link>
            </h2>
            <partial-card-sheet v-if="sections[i].text" content-only :sheet="sections[i]" :topic="response.instance"/>
            <div class="flex flex-wrap -mx-2 masonry-sub">
              <div
                v-for="item in posts" :key="item.id"
                class="p-2 masonry-item w-full"
                :class="[colum > 2 ? 'w-1/2': '', `xl:w-1/${sections[i].meta?.layout || colum}`]"
              >
                <partial-card-sheet :sheet="item" :topic="response.instance"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="hidden md:block md:w-64 bg-white space-y-4 py-4">
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
