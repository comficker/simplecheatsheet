<script setup lang="ts">
import {PhotoIcon} from '@heroicons/vue/24/solid'
import type {Topic, Post} from "~/interface";
import type {ResponsePost} from "~/interface";
import {useUserStore} from "#imports";

const config = useRuntimeConfig()
const route = useRoute()
const us = useUserStore()
const form = ref<{
  id: number
  name: string
  desc: string
  id_string: string
  tags: string[]
  media: null | ''
  db_status: number
}>({
  id: 0,
  name: '',
  desc: '',
  id_string: '',
  tags: [],
  media: null,
  db_status: 0
})
const posts = ref<Post[]>([])

if (route.query.id) {
  const {data: response} = await useAuthFetch<ResponsePost>(`/cs/posts/`, {
    params: {
      "topic__id_string": route.query.id,
      "page_size": 1000
    }
  }).catch(() => {
    throw createError({
      statusCode: 404,
      statusMessage: 'Page Not Found'
    })
  })
  if (response.value) {
    form.value.db_status = response.value.instance.db_status
    form.value.id = response.value.instance.id
    form.value.id_string = response.value.instance.id_string
    form.value.name = response.value.instance.name
    form.value.desc = response.value.instance.desc
    form.value.tags = response.value.instance.taxonomies.map(x => x.name)
    form.value.media = response.value.instance.media ? `${config.public.apiBase}${response.value.instance.media.path}` : null
    posts.value = response.value.results.filter((x: Post) => !x.parent).map(x => ({
      ...x,
      children: response.value?.results.filter((y: Post) => y.parent == x.id)
    }))
  }
}

const txt = ref('')
const addTag = function () {
  if (!form.value.tags.includes(txt.value)) {
    form.value.tags.push(txt.value)
    txt.value = ''
  }
}

const submit = async (e: Event) => {
  e.preventDefault()
  const {data: response} = await useAuthFetch<Topic>(`/cs/update-topic/`, {
    method: "POST",
    body: JSON.parse(JSON.stringify(form.value))
  });
  if (response.value)
    form.value.id = response.value.id
}

const openFile = function (file) {
  const input = file.target;
  const reader = new FileReader();
  reader.onload = function () {
    form.value.media = reader.result
  };
  reader.readAsDataURL(input.files[0]);
};

useHead({
  script: [
    {src: '/ck/ckeditor.js', async: true}
  ],
})

const addPost = async (parent: Post | null) => {
  const n = {
    name: 'Untitled',
    desc: '',
    text: '',
    parent: parent ? parent.id : null,
    topic: form.value.id,
    children: [],
    expanded: false,
    user: us.logged.id
  } as unknown as Post
  const {data: post} = await useAuthFetch<Post>(`/cs/posts/`, {
    method: "POST",
    body: n
  })
  if (post.value) {
    if (parent) {
      parent.children?.push(post.value)
    } else {
      posts.value.push(post.value)
    }
  }
}
</script>

<template>
  <form class="px-4 mx-auto max-w-xl py-8 space-y-4 overflow-hidden" @keydown.enter="$event.preventDefault()">
    <div>
      <h2 class="text-3xl font-semibold leading-7 text-gray-900">Submission form</h2>
      <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-6">
        <div class="sm:col-span-4">
          <label for="name" class="block font-medium leading-6 text-gray-900">Name</label>
          <div class="mt-2">
            <div
              class="flex rounded shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
              <input
                v-model="form.name"
                required
                type="text" name="name" id="name" autocomplete="username"
                class="block flex-1 border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                placeholder="Something"/>
            </div>
          </div>
        </div>
        <div class="sm:col-span-4">
          <label for="id_string" class="block font-medium leading-6 text-gray-900">Short name</label>
          <div class="mt-2">
            <div
              class="flex rounded shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
              <span
                class="flex select-none items-center pl-3 text-gray-500 sm:text-sm">https://simplecheatsheet.com/</span>
              <input
                required
                v-model="form.id_string"
                type="text" name="id_string" id="id_string" autocomplete="id_string"
                class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                placeholder="something"/>
            </div>
          </div>
        </div>
        <div class="col-span-full">
          <label for="photo" class="block font-medium leading-6 text-gray-900">Photo</label>
          <div class="mt-2 flex items-center gap-x-3">
            <div class="">
              <img v-if="form.media" class="h-20 w-20 object-cover" :src="form.media" alt="">
              <PhotoIcon v-else class="h-20 w-20 text-gray-300 object-cover" aria-hidden="true"/>
            </div>
            <input
              type="file"
              class="block w-full text-sm text-gray-500
                    file:me-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-600 file:text-white
                  "
              @change="openFile"
            >
          </div>
        </div>
        <div class="col-span-full">
          <label for="about" class="block font-medium leading-6 text-gray-900">Description</label>
          <div class="mt-2">
            <textarea
              v-model="form.desc"
              id="about" name="about" rows="3"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
            />
          </div>
        </div>
        <div class="col-span-full">
          <label class="block font-medium leading-6 text-gray-900">Tags</label>
          <div class="mt-2">
            <div
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
            >
              <div class="flex flex-wrap font-medium px-1 font-medium">
                <div v-for="(item, i) in form.tags" :key="item" class="p-1">
                  <div
                    class="py-0.5 px-4 bg-gray-100 rounded"
                    @click="form.tags.splice(i, 1)"
                  >{{ item }}
                  </div>
                </div>
                <div class="p-1">
                  <input
                    v-model="txt"
                    class="block h-full w-full border-0 py-0 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0"
                    placeholder="add..."
                    @keyup.enter="addTag"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="form.id" class="mt-6 space-y-3">
        <div class="block font-medium leading-6 text-gray-900 flex gap-3">
          <span>Sheets</span>
          <span class="text-red-400">Auto save is on!</span>
        </div>
        <div v-for="(item, i) in posts" :key="`p_${i}`" class="space-y-4">
          <div class="group flex gap-2 items-center cursor-pointer">
            <div
              :class="[item.expanded ? 'i-con-chevron-down': 'i-con-chevron-right', 'w-4 h-4']"
              @click="item.expanded = !item.expanded"/>
            <div class="h-6 min-w-16">
              <input type="text" class="border-0 p-0" v-model="item.name" :class="{'line-through': item.db_status == -1}">
            </div>
            <div class="flex gap-4 ml-auto">
              <div class="flex items-center">
                <input
                  type="checkbox" :checked="!!item.db_status"
                  :disabled="item.db_status === -1"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  @input="item.db_status = item.db_status ? 0 : 1"
                >
                <label
                  for="link-checkbox"
                  class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Public</label>
              </div>
              <div class="w-4 h-5 text-red-500 duration-300 i-con-delete"  @click="item.db_status = -1"/>
            </div>
          </div>
          <div v-show="item.expanded" class="space-y-4 md:ml-6">
            <client-only>
              <partial-editor :post="item"/>
            </client-only>
            <div
              v-for="(child, j) in item.children" :key="`c_${j}`"
              class="space-y-2"
            >
              <div class="group flex gap-2 items-center cursor-pointer">
                <div
                  :class="[child.expanded ? 'i-con-chevron-down': 'i-con-chevron-right', 'w-4 h-4']"
                  @click="child.expanded = !child.expanded"/>
                <div class="h-6 min-w-16">
                  <input
                    type="text"
                    class="border-0 p-0 focus:outline-none" :class="{'line-through': child.db_status == -1}"
                    v-model="child.name" placeholder="Title"
                  >
                </div>
                <div class="ml-auto flex gap-4">
                  <div class="flex items-center">
                    <input
                      type="checkbox" :checked="!!child.db_status"
                      :disabled="child.db_status === -1"
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      @input="child.db_status = child.db_status ? 0 : 1"
                    >
                    <label
                      for="link-checkbox"
                      class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Public</label>
                  </div>
                  <div class="w-4 h-5 text-red-500 duration-300 i-con-delete" @click="child.db_status = -1"/>
                </div>
              </div>
              <div v-show="child.expanded">
                <client-only>
                  <partial-editor :post="child"/>
                </client-only>
              </div>
            </div>
            <div class="group inline-flex rounded gap-2 items-center cursor-pointer font-semibold border p-1 px-3"
                 @click="addPost(item)">
              <div class="w-4 h-4 i-con-plus"/>
              <span>Add child</span>
            </div>
          </div>
        </div>
        <div
          class="group inline-flex rounded gap-2 items-center cursor-pointer font-semibold border p-1 px-3"
          @click="addPost(null)">
          <div class="w-4 h-4 i-con-plus"/>
          <span>Add sheet</span>
        </div>
      </div>
    </div>
    <div class="sticky bottom-0 py-3 bg-white mt-6 flex items-center justify-end gap-x-6">
      <div class="flex items-center mr-auto">
        <input
          type="checkbox" :checked="!!form.db_status"
          :disabled="form.db_status === -1"
          class="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          @input="form.db_status = form.db_status ? 0 : 1"
        >
        <label
          for="link-checkbox"
          class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Public</label>
      </div>
      <a :href="`/${form.id_string}`" target="_blank" class="rounded-md bg-gray-100 px-6 py-2 font-semibold">Preview</a>
      <button
        type="submit"
        class="rounded-md bg-indigo-600 px-6 py-2 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        @click="submit"
      >
        Save
      </button>
    </div>
  </form>
</template>
