<script setup lang="ts">
import {useRoute} from "#app";
import {useUserStore} from "~/stores/user";
import type {Post, ResponsePost} from "~/interface";
import showdown from "showdown";
import {ChevronRightIcon} from "@heroicons/vue/20/solid";

const converter = new showdown.Converter()
converter.setOption('tables', true);

const config = useRuntimeConfig()
const route = useRoute()
const us = useUserStore()
const [{data: response}, {data: related}] = await Promise.all([
  useAuthFetch<Post>(`/cs/posts/${route.params.post}`),
  useAuthFetch<ResponsePost>(`/cs/posts/?related=${route.params.post}`, {
    params: {
      "page_size": 100,
    }
  })
])
const post = computed<Post>(() => {
  const out = response.value || {} as Post
  out.children = related.value?.results.filter((p: Post) => p.parent == out.id).sort((a, b) => {
    const s = out.meta?.sort || []
    return s.indexOf(a.id) - s.indexOf(b.id)
  }) || []
  return out
})
const html = computed(() => {
  return converter.makeHtml(post.value.text)
})

const sections = ref<Post[]>([])
if (related.value) {
  sections.value = related.value.results.filter((x: Post) => !x.parent).sort((a, b) => {
    const s = post.value.topic.meta?.sort || []
    return s.indexOf(a.id) - s.indexOf(b.id)
  }).map(x => {
    if (related.value) {
      x.children = related.value?.results.filter((p: Post) => p.parent == x.id).sort((a, b) => {
        const s = x.meta?.sort || []
        return s.indexOf(a.id) - s.indexOf(b.id)
      }) || []
    }
    return x
  }) || []
}

us.setBC([{
  name: post.value.topic.name,
  current: true,
  href: `/${post.value.topic.id_string}`
}, {
  name: post.value.name,
  current: true,
  href: `/${post.value.topic.id_string}/${post.value.id_string}`
}])

const title = computed(() => {
  let name = post.value.name
  if (post.value.parent) name = name + ` - ${post.value.parent.name}`
  name = name + ` - ${post.value.topic.name}`
  return name
})

useHead({
  title: title.value,
  meta: [
    {name: 'description', content: post.value.desc}
  ]
})

useSeoMeta(() => ({
  title: title.value,
  ogTitle: title.value,
  description: post.value.desc,
  ogDescription: post.value.desc,
  ogImage: '/default.png',
  twitterCard: 'summary_large_image',
}))

</script>

<template>
  <div class="p-4 md:py-8 max-w-4xl mx-auto flex flex-col md:flex-row gap-6">
    <div class="md:w-2/3 space-y-3">
      <div class="space-y-2 font-medium">
        <div class="flex gap-3 items-center">
          <nuxt-link
            class="p-0.5 px-2 rounded bg-gradient-to-r from-green-200 flex gap-2 items-center"
            :to="`/${post.topic.id_string}`"
          >
            <div v-if="post.topic.media" class="flex-none">
              <img
                class="w-5"
                :src="config.public.apiBase + post.topic.media.sizes.thumb_128"
                :alt="post.topic.name"
              >
            </div>
            <span>{{post.topic.name}}</span>
          </nuxt-link>
          <div v-if="post.parent">
            <nuxt-link :to="`/${post.topic.id_string}/${post.parent.id_string}`" class="flex items-center">
              <ChevronRightIcon class="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true"/>
              <span class="ml-4 font-medium text-gray-500 hover:text-gray-700">{{ post.parent.name }}</span>
            </nuxt-link>
          </div>
        </div>
        <h1 class="text-3xl font-bold">{{ post.name }}</h1>
      </div>
      <div v-if="post.text" class="sheet">
        <div v-html="html"></div>
      </div>
      <div v-for="item in post.children">
        <partial-card-sheet :sheet="item" :topic="post.topic"/>
      </div>
      <partial-comment/>
    </div>
    <div class="space-y-3">
      <div class="font-medium uppercase text-xs">Related</div>
      <ul class="text-sm">
        <li
          v-for="item in sections" :key="item.id"
        >
          <div class="flex gap-2 items-center">
            <div class="i-con-chevron-right h-4 w-4" @click="item.expanded = !item.expanded"/>
            <nuxt-link :to="`/${post.topic.id_string}/${item.id_string}`">{{ item.name }}</nuxt-link>
          </div>
          <ul v-if="item.children?.length && item.expanded" class="list-disc pl-10">
            <li v-for="sub in item.children" :key="sub.id">
              <nuxt-link :to="`/${post.topic.id_string}/${sub.id_string}`">{{ sub.name }}</nuxt-link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>

</style>
