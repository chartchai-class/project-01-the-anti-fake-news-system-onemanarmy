<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useMessageStore } from '@/stores/message';
import { storeToRefs } from 'pinia'
import { SpeedInsights } from '@vercel/speed-insights/vue';

const store = useMessageStore()
const { messages } = storeToRefs(store)
</script>

<template>
    <SpeedInsights />
  <div class="text-center font-sans text-gray-700 antialias">
    <header>
      <div id="flashMessage" class="animate-fade" v-if="messages">
        <h4>{{ messages }}</h4>
      </div>
      <h1>Deploy with vercel</h1>
      <div class="wrapper">
        <nav class="py-6 p-[80px]">
          <RouterLink class="font-bold text-gray-700" exact-active-class="text-green-500" :to="{name: 'event-list-view'}">Event</RouterLink>
          <RouterLink class="font-bold text-gray-700" exact-active-class="text-green-500" :to="{name: 'about'}">About</RouterLink>
          <RouterLink class="font-bold text-gray-700" exact-active-class="text-green-500" :to="{name: 'students'}">Students</RouterLink>
        </nav>
      </div>
    </header>
    <RouterView />
  </div>
</template>

<style>
nav{
  padding: 30px;
}

nav a{
  font-weight: bold;
  color: #2c3e50;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

h2{
  font-size: 20px;
}

@keyframes yellofade {
  from {
    background-color: yellow;
  }
  to {
    background-color: transparent;
  }
}

#flashMessage {
  animation: yellofade 3s ease-in-out;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>

<!--
text-center — ทำให้ข้อความอยู่กึ่งกลาง
font-sans — ใช้ฟอนต์แบบ sans-serif
text-gray-700 — กำหนดสีข้อความเป็นสีเทาเข้ม
antialiased — ทำให้ตัวอักษรคมชัดขึ้น
-->
