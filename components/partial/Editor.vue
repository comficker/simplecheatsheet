<script setup lang="ts">
import type {Post} from "~/interface";
import showdown from "showdown";
import pkg from "lodash";
import {useUserStore} from "#imports";
import {string_to_slug} from "~/helper/parser"

const {debounce} = pkg;
const us = useUserStore()
const converter = new showdown.Converter()
converter.setOption('tables', true);
const {post} = defineProps<{ post: Post }>()
const html = computed(() => {
  return converter.makeHtml(post.text)
})
const text = ref(html.value)
const call = ref(1)
const handleInput = debounce(() => {
  const payload = post
  payload.text = text.value
  if (payload.text) payload.text.trim()
  if (us.isLogged && post.id_string) {
    useAuthFetch(`/cs/posts/${post.id}/`, {
      method: "PUT",
      body: payload,
      watch: false
    })
  }
  call.value++
}, 1500)

watch(() => [post.name, text, post.db_status, post.id_string, post.meta], (value, oldValue, onCleanup) => {
  if (value[0] != oldValue[0]) {
    post.id_string = string_to_slug(value[0])
  }
  handleInput()
}, {deep: true})

watch(() => post.expanded, (n) => {
  if (n) {
    BalloonEditor
      .create(document.querySelector(`#editor_${post.id}`))
      .then((editor: any) => {
        editor.setData(html.value || '')
        editor.model.document.on('change:data', () => {
          text.value = editor.getData()
        });
        window.ck = editor
      })
      .catch((error: any) => {
        console.error(error);
      });
  } else {
    if (window.ck) {
      window.ck.destroy()
    }
  }
})
</script>

<template>
  <div>
    <div class="space-y-2 pb-3" :id="`editor_${post.id}`"/>
  </div>
</template>

<style>
.ql-editor {
  min-height: 200px;
}
</style>
