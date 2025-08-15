<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useOrdersStore } from '@/stores/orders'

const auth = useAuthStore()
const cart = useCartStore()
const orders = useOrdersStore()
const router = useRouter()

const total = computed(() => cart.total)

async function finalize() {
  if (!auth.user) return router.push({ name: 'login', query: { redirect: '/checkout' } })
  const order = await orders.createOrder({
    clientId: auth.user.clientId || auth.user.id,
    items: cart.items.map(({ id, name, price, qty }) => ({ id, name, price, qty })),
    total: total.value,
  })
  cart.clear()
  router.replace({ name: 'checkout-success', query: { id: order.id } })
}
</script>

<template>
  <main class="container">
    <h1 class="page-title">Checkout</h1>
    <div class="card">
      <div v-if="!cart.items.length" class="muted">Seu carrinho está vazio.</div>
      <ul v-else class="cart">
        <li v-for="it in cart.items" :key="it.id" class="row between">
          <span>{{ it.name }} × {{ it.qty }}</span>
          <span>{{
            (it.price * it.qty).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
          }}</span>
        </li>
      </ul>
      <div class="row between" style="margin-top: 8px">
        <strong>Total</strong>
        <strong>{{ total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}</strong>
      </div>
      <div class="row gap" style="margin-top: 12px">
        <button class="btn" @click="$router.back()">Voltar</button>
        <button class="btn primary" :disabled="!cart.items.length" @click="finalize">
          Confirmar pedido
        </button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.cart {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 6px;
}
</style>
