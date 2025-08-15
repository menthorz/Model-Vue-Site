<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
</script>
<template>
  <main class="container">
    <div class="card">
      <h1>Pedido confirmado</h1>
      <p class="muted">Número do pedido: {{ route.query.id }}</p>
      <p>Você receberá atualizações por e-mail.</p>
    </div>
  </main>
</template>
