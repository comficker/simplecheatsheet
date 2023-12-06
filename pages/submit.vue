<script setup lang="ts">
import {PhotoIcon} from '@heroicons/vue/24/solid'
import type {Topic} from "~/interface";
import {useRouter} from "#app";

const route = useRoute()
const form = ref<{
  id: number
  name: string
  desc: string
  id_string: string
  tags: string[]
  media: null | ''
}>({
  id: 0,
  name: '',
  desc: '',
  id_string: '',
  tags: [],
  media: null
})

if (route.query.id) {
  const {data: response} = await useAuthFetch<Topic>(`/cs/topics/${route.query.id}/`);
  if (response.value) {
    form.value.id = response.value.id
    form.value.id_string = response.value.id_string
    form.value.name = response.value.name
    form.value.desc = response.value.desc
    form.value.tags = response.value.taxonomies.map(x => x.name)
    form.value.media = response.value.media ? response.value.media.path : null
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
  if (!form.value.id) {
    form.value.name = ""
    form.value.id_string = ""
    form.value.desc = ""
    form.value.media = null
    form.value.tags = []
  }
}

const openFile = function (file) {
  const input = file.target;
  const reader = new FileReader();
  reader.onload = function () {
    form.value.media = reader.result
  };
  reader.readAsDataURL(input.files[0]);
};
</script>

<template>
  <form class="mx-auto max-w-xl py-8 space-y-4" @keydown.enter="$event.preventDefault()">
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
              <img v-if="form.media" class="h-20 w-20" :src="form.media" alt="">
              <PhotoIcon v-else class="h-20 w-20 text-gray-300" aria-hidden="true"/>
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
    </div>
    <div class="py-3 bg-white mt-6 flex items-center justify-end gap-x-6">
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
