<script setup lang="ts">
import type {Post} from "~/interface";
import * as showdown from "showdown"

const {sheet, contentOnly} = defineProps<{ sheet: Post, contentOnly?: boolean }>()

const converter = new showdown.Converter()
converter.setOption('tables', true);

const html = computed(() => {
  let text = sheet.text.replace(/\n{2,}/g, m => m.replace(/\n/g, "<br/>"));
  text = text.replace(/<br\/>([^<])/g, "<br\/>\n\n$1");
  text = text.replace(/^\s+|\s+$/g, '')
  return converter.makeHtml(text)
})
</script>

<template>
  <div class="sheet no-scrollbar">
    <h4
      v-if="!contentOnly" class="inline-flex mb-2 p-1 pr-8 rounded shadow font-bold bg-gradient-to-r from-green-300"
    >{{ sheet.name}}</h4>
    <div class="content" v-html="html"></div>
  </div>
</template>

<style>
.sheet {
  @apply text-sm overflow-auto p-3 border-gray-100 bg-green-50/70;

  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 6px 8px rgba(102, 119, 136, 0.03), 0 1px 2px rgba(102, 119, 136, 0.3);
  --tw-shadow-colored: 0 6px 8px var(--tw-shadow-color), 0 1px 2px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
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
  @apply capitalize;
}

.sheet th,
.sheet td {
  @apply py-2;
}

.sheet th:not(:last-child),
.sheet td:not(:last-child) {
  @apply pr-4;
}

.sheet code {
  @apply inline-flex rounded bg-gray-100 p-1 my-0.5 px-3 border overflow-auto no-scrollbar font-mono text-xs;

  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */
}

.sheet pre code {
  @apply w-full;
}

.sheet code::-webkit-scrollbar {
  display: none; /* Safari and Chrome */
}

</style>

