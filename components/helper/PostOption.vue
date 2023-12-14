<template>
  <Popover v-slot="{ open }" class="relative">
    <PopoverButton
      :class="open ? 'text-white' : 'text-white/90'"
      class="flex items-center"
      as="div"
    >
      <CogIcon
        :class="open ? 'text-orange-300' : 'text-orange-300/70'"
        class="h-4 w-4 transition duration-150 ease-in-out group-hover:text-orange-300/80"
        aria-hidden="true"
      />
    </PopoverButton>

    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-1 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-1 opacity-0"
    >
      <PopoverPanel
        class="absolute left-1/2 z-10 mt-3 -translate-x-32 transform w-64"
      >
        <div class="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5 bg-white">
          <div class="p-3 space-y-3">
            <div>
              <label class="block font-medium leading-6 text-gray-900">Slug</label>
              <div
                class="flex rounded shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
              <span
                class="flex select-none items-center pl-3 text-gray-500 sm:text-sm">/</span>
                <input
                  required
                  v-model="value.id_string"
                  type="text" name="id_string" id="id_string" autocomplete="id_string"
                  class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="something"/>
              </div>
            </div>
            <div>
              <label class="block font-medium leading-6 text-gray-900">Layout</label>
              <div class="mt-2 grid grid-cols-3 gap-2">
                <div v-for="i in 3">
                  <div
                    class="p-2 bg-gray-100 rounded cursor-pointer"
                    :class="value.meta.layout === i ? 'border border-blue-500': ''"
                    @click="value.meta.layout = i"
                  >
                    <div class="grid gap-2" :class="[`grid-cols-${i}`]">
                      <div v-for="j in i" :key="j" class="h-6 bg-white rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PopoverPanel>
    </transition>
  </Popover>
</template>

<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { CogIcon } from '@heroicons/vue/20/solid'
import type {Post} from "~/interface";

const {modelValue} = defineProps<{modelValue: Post}>()
const emits = defineEmits(['update:modelValue'])

const value = ref({
  ...modelValue,
  meta: {
    ...modelValue.meta,
    layout: modelValue.meta?.layout || 3
  }
})

watch(value, () => {
  emits('update:modelValue', value.value)
}, {deep: true})
</script>
