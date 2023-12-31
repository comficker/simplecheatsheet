<script setup lang="ts">
import type {Post, Topic} from "~/interface";
import showdown from "showdown"

const {sheet, contentOnly, topic} = defineProps<{ sheet: Post, contentOnly?: boolean, topic: Topic }>()

const converter = new showdown.Converter()
converter.setOption('tables', true);

const html = computed(() => {
  let text = sheet.text
  //   .replace(/\n{2,}/g, m => m.replace(/\n/g, "<br/>"));
  // text = text.replace(/<br\/>([^<])/g, "<br\/>\n\n$1");
  // text = text.replace(/^\s+|\s+$/g, '')
  return converter.makeHtml(text)
})
</script>

<template>
  <div class="sheet no-scrollbar">
    <h4
      v-if="!contentOnly"
      class="inline-flex pl-2 pr-16 rounded font-medium text-sm uppercase text-white bg-gradient-to-r from-purple-500"
    >
      <nuxt-link :to="`/${topic.id_string}/${sheet.id_string}`">
        {{ sheet.name}}
      </nuxt-link>
    </h4>
    <div class="content" v-html="html"></div>
  </div>
</template>

<style>
.sheet {
  @apply overflow-auto p-3 border border-gray-100 relative space-y-2;
  border-radius: 2px;
}

.sheet .content {
  @apply space-y-2;
}

.sheet table {
  @apply table-auto text-left w-full;
}

.sheet table:not(:last-child) {
  @apply mb-4;
}

.sheet tr {
  @apply border-b border-dashed border-gray-100;
}

.sheet th {
  @apply capitalize text-xs;
}

.sheet th,
.sheet td {
  @apply py-1 min-w-40;
}

.sheet th:not(:last-child),
.sheet td:not(:last-child) {
  @apply pr-4;
}

.sheet code {
  @apply inline-flex rounded bg-gray-100 p-0.5 my-0.5 px-2 border overflow-auto no-scrollbar font-mono text-xs;

  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */
}

.sheet pre code {
  @apply w-full;
}

.sheet code::-webkit-scrollbar {
  display: none; /* Safari and Chrome */
}

.sheet ul {
  @apply list-disc pl-4;
}
</style>

