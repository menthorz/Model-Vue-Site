<script setup>
defineProps({
  title: { type: String, default: 'Nada por aqui' },
  description: { type: String, default: '' },
})
</script>

<template>
  <div class="empty">
    <h3>{{ title }}</h3>
    <p v-if="description" class="muted">{{ description }}</p>
  </div>
</template>

<style scoped>
.empty {
  border: 1px dashed #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
}
.muted {
  color: #6b7280;
}
</style>
