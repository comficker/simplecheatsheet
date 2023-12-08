<script setup lang="ts">
import type {Post} from "~/interface";
import showdown from "showdown";
import pkg from "lodash";
import {useUserStore} from "#imports";

const {debounce} = pkg;
const us = useUserStore()
const converter = new showdown.Converter()
converter.setOption('tables', true);
const {post} = defineProps<{ post: Post }>()
const html = computed(() => {
  return converter.makeHtml(post.text)
})

const handleInput = debounce((value: string) => {
  if (us.isLogged) {
    useAuthFetch(`/cs/posts/${post.id_string}/`, {
      method: "PUT",
      body: {
        ...post,
        text: value
      }
    })
  }
}, 1500)

onMounted(() => {
  ClassicEditor
    .create(document.querySelector(`#editor_${post.id}`), {})
    .then(editor => {
      editor.setData(html.value || '')
      editor.model.document.on('change:data', () => {
        handleInput(editor.getData())
      });
    })
    .catch(error => {
      console.error(error);
    });
})
</script>

<template>
  <div class="">
    <div :id="`editor_${post.id}`"/>
  </div>
</template>

<style>
.ql-editor {
  min-height: 200px;
}
</style>
