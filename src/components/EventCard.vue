<script setup lang="ts">
import EventInfo from './EventInfo.vue'
import { type  Event } from '@/types'
defineProps<{
  event: Event
}>();
// const event = ref ({
//   id: 5928101,
//   category: 'animal welfare',
//   title: 'Cat Adoption Day',
//   description: 'Find your new feline friend at this event.',
//   location: 'Meow Town',
//   date: 'January 28, 2022',
//   time: '12:00',
//   petsAllowed: true,
//   organizer: 'Kat Laydee',
// })
</script>

<template>
  <RouterLink class="event-link" :to="{ name: 'event-detail-view', params: { id: event.id } }">
    <div class="cursor-pointer border border-gray-600 p-[20px] w-[250px] mb-[18px] hover:scale-101 hover:shadow-sp">
      <h2>{{ event.title }}</h2>
      <EventInfo :category="event.category" :organizer="event.organizer" />
      <span>@{{ event.time }} on {{ event.date }}</span>
    </div>
  </RouterLink>
</template>

<style>
  .event-card {
    padding: 20px;
    width: 250px;
    cursor: pointer;
    border: 1px solid #39495c;
    margin-bottom: 18px;
  }

  /* .event-card:hover {
    transform: scale(1.01);
    box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.2);
  } */

  .event-link {
    text-decoration: none;
    color: #2c3e50;
  }
</style>

<!-- hover:scale-101 — ขยายขนาดขึ้น 1% เมื่อเอาเมาส์ไปชี้
hover:shadow-sp — เพิ่มเงาเมื่อเอาเมาส์ไปชี้ (shadow-sp น่าจะเป็น custom class ถ้าไม่ใช่ของ tailwind ปกติ)
cursor-pointer — เปลี่ยนเมาส์เป็นรูปมือเมื่อชี้
border — ใส่เส้นขอบให้ element
border-gray-600 — กำหนดสีขอบเป็นเทาเข้ม (#4B5563)
p-4 — กำหนดระยะขอบ (padding) เท่ากับ 1rem รอบด้าน
w-64 — กำหนดความกว้าง 16rem
mb-6 — กำหนดระยะห่างด้านล่าง (margin-bottom) 1.5rem -->
