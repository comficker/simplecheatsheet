// @ts-ignore
import { VueMasonryPlugin } from "vue-masonry/src/masonry.plugin";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueMasonryPlugin);
});
