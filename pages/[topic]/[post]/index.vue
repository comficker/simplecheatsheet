<script lang="ts" setup>
import {useRoute} from "#app";

const route = useRoute()
</script>
<template>
  <partial-sheet v-if="route.params.topic !== 'profile'"/>
  <partial-profile v-else/>
</template>
