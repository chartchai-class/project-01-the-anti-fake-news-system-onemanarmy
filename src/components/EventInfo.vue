<script setup lang="ts">
defineProps<{
  category: string;
  organizer: string;
}>();
</script>

<template>
  <div class="info">
    <div>{{ category }}</div>
    <div>{{ organizer }}</div>
  </div>
</template>

<style scoped>
.info {
  text-align: right;
  font-size: 14px;
}
</style>
