<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useOrdersStore } from '@/stores/orders'

const auth = useAuthStore()
const orders = useOrdersStore()

onMounted(() => {
  if (auth.user?.clientId) orders.fetchMy(auth.user.clientId)
})
</script>

<template>
  <main class="container">
    <h1 class="page-title">Meus pedidos</h1>
    <div v-if="!orders.orders.length" class="muted">Você ainda não possui pedidos.</div>
    <ul v-else class="stack">
      <li v-for="o in orders.orders" :key="o.id" class="card row between">
        <div>
          <strong>#{{ o.id }}</strong>
          <div class="muted">{{ new Date(o.createdAt).toLocaleString('pt-BR') }}</div>
        </div>
        <div>
          <strong>{{
            o.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
          }}</strong>
        </div>
      </li>
    </ul>
  </main>
</template>
