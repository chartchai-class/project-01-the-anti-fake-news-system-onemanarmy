<script setup lang="ts">
import { toRefs} from 'vue'
import { type Event } from '@/types'
import { useRouter } from 'vue-router';
import { useMessageStore } from '@/stores/message';

const props = defineProps<{
  event: Event
  id: string
}>()
const { event } = toRefs(props)
const router = useRouter()
const store = useMessageStore()
const edit = () => {
  store.updateMessages('You are successfully edit for '+props.event.title)
  setTimeout(() => {
    store.resetMessages()
  }, 3000)
  router.push({ name: 'event-detail-view' , params: { id: props.event.id } })
}
</script>

<template>
        <p>Edit event here</p>
        <button @click="edit">Edit Me!</button>
</template>
