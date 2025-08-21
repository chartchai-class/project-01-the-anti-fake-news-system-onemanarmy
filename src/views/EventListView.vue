<script setup lang="ts">
import EventCard from '@/components/EventCard.vue'
import { type Event } from '@/types'
import { ref, onMounted, computed, watchEffect, watch } from 'vue'
import EventService from '@/services/EventService'
import { useRouter } from 'vue-router'
const router = useRouter()

const events = ref<Event[] | null>(null)
const totalEvents = ref(0)
const hasNextPage = computed(()=> {
 const totalPages = Math.ceil(totalEvents.value / 3)
 return page.value < totalPages
})

const props = defineProps({
  page: {
    type: Number,
    required: true,
  },
})

const page = computed(() => props.page)
onMounted(() => {
  watchEffect(() => {
    EventService.getEvents(3 , page.value)
      .then(response => {
        events.value = response.data
        totalEvents.value = response.headers['x-total-count']
      })
      .catch(error => {
        router.push({ name: 'network-error-view' })
      })
  })
})
</script>

<template>
  <h1>Event For Good</h1>
    <!-- new element-->
  <div class="flex flex-col items-center">
    <EventCard v-for="event in events" :key="event.id" :event="event" />

  <RouterLink  class="flex-1 no-underline text-gray-800 text-left"
    :to="{ name: 'event-list-view', query: { page: page - 1 } }"
    rel="prev"
    v-if="page != 1"
    > &#60; Prev page </RouterLink
  >
  <RouterLink class="flex-1 no-underline text-gray-800 text-right"
    :to="{ name: 'event-list-view', query: { page: page + 1 } }"
    rel="next"
    v-if="hasNextPage"
    > Next page &#62; </RouterLink
  ></div>
</template>

<!--
flex — กำหนดให้เป็น flexbox
flex-col — เรียงลูกแบบแนวตั้ง
items-center — จัดลูกให้อยู่ตรงกลางแนวนอน
-->
