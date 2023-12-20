<script setup lang="ts">
import {useRouter} from "#app";

const router = useRouter()
const {$login, $register, $forgot} = useNuxtApp()
const username = ref('')
const password = ref('')
const email = ref('')
const mode = ref<'login' | 'register' | 'forgot'>('login')
const errors = ref<string[]>([])

const validate = () => {
  errors.value = []
  if (['forgot', 'register'].includes(mode.value)) {
    if (!email.value) {
      errors.value.push("Email is required")
    }
  }
  if (['login', 'register'].includes(mode.value)) {
    if (!username.value) {
      errors.value.push("Username is required")
    }
    if (!password.value) {
      errors.value.push("Password is required")
    }
  }
  return errors.value.length === 0
}
const login = () => {
  if (!validate()) return
  switch (mode.value) {
    case "forgot":
      $forgot(email.value)
      break
    case "login":
      $login(username.value, password.value)
      break
    case "register":
      $register(username.value, password.value, email.value)
      break
  }
}

useHead({
  title: "Hi, Guess!"
})
</script>
<template>
  <div class="flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
    <div class="w-full max-w-sm space-y-4">
      <nuxt-link to="/">
        <img
          class="mx-auto w-36" src="/logo.png"
          alt=""
        />
      </nuxt-link>
      <div class="relative">
        <div class="pointer-events-none absolute inset-0 z-10 ring-1 ring-inset ring-gray-200 rounded"/>
        <div class="relative -space-y-px">
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <input
              v-model="username"
              id="username" name="email" type="text" autocomplete="Username" required=""
              class="relative block w-full border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="username"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              v-model="password"
              id="password" name="password" type="password" autocomplete="current-password" required=""
              class="relative block w-full border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Password"
            />
          </div>
        </div>
        <div class="p-3">
          <div>
            <div
              @click="login"
              class="cursor-pointer flex w-full justify-center bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              <span v-if="mode === 'login'">Sign in</span>
              <span v-if="mode === 'register'">Signup</span>
              <span v-if="mode === 'forgot'">Send me an email</span>
            </div>
          </div>
        </div>
      </div>
      <div class="flex gap-3 uppercase text-xs font-semibold">
        <div
          :class="['cursor-pointer']"
          @click="mode = mode === 'register' ? 'login': 'register'"
        >{{mode === 'register' ? 'Login': 'Signup'}}
        </div>
        <div :class="mode === 'forgot' ? 'text-blue-500': 'cursor-pointer'" @click="mode = 'forgot'">Forgot password
        </div>
      </div>
    </div>
  </div>
</template>
