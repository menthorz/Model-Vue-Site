<script setup>
import { onMounted } from 'vue'
import { useProductsStore } from '@/stores/products'
import { useServicesStore } from '@/stores/services'
import { useCartStore } from '@/stores/cart'

const products = useProductsStore()
const services = useServicesStore()
const cart = useCartStore()

onMounted(async () => {
  await Promise.all([
    products.fetchProducts(),
    services.fetchServices?.() || services.fetch?.() || services.fetchServices?.(),
  ])
})

function addProduct(p) {
  cart.add(p)
}
function addService(s) {
  cart.add({ id: `svc-${s.id}`, name: s.name, price: s.price })
}
</script>

<template>
  <main class="container">
    <h1 class="page-title">Loja</h1>
    <section class="grid-2">
      <div>
        <h2>Serviços</h2>
        <div class="list">
          <article v-for="s in services.services" :key="s.id" class="card row between">
            <div>
              <strong>{{ s.name }}</strong>
              <div class="muted">Duração: {{ s.duration }}min</div>
            </div>
            <div class="row gap">
              <span class="price">{{
                s.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
              }}</span>
              <button class="btn" @click="addService(s)">Adicionar</button>
            </div>
          </article>
        </div>
      </div>
      <div>
        <h2>Produtos</h2>
        <div class="list">
          <article v-for="p in products.products" :key="p.id" class="card row between">
            <div>
              <strong>{{ p.name }}</strong>
            </div>
            <div class="row gap">
              <span class="price">{{
                p.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
              }}</span>
              <button class="btn" @click="addProduct(p)">Adicionar</button>
            </div>
          </article>
        </div>
      </div>
    </section>

    <aside class="card" style="margin-top: 24px">
      <h2>Carrinho ({{ cart.count }})</h2>
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
        <strong>{{
          cart.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        }}</strong>
      </div>
      <div class="row gap" style="margin-top: 12px">
        <button class="btn" @click="cart.clear()" :disabled="!cart.items.length">Limpar</button>
        <RouterLink
          class="btn primary"
          :class="{ disabled: !cart.items.length }"
          :to="{ name: 'checkout' }"
          @click.prevent="$router.push({ name: 'checkout' })"
          :aria-disabled="!cart.items.length"
          >Finalizar</RouterLink
        >
      </div>
    </aside>
  </main>
</template>

<style scoped>
.grid-2 {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}
@media (min-width: 800px) {
  .grid-2 {
    grid-template-columns: 1fr 1fr;
  }
}
.row {
  display: flex;
  align-items: center;
}
.between {
  justify-content: space-between;
}
.gap {
  gap: 8px;
}
.list {
  display: grid;
  gap: 10px;
}
.cart {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 6px;
}
.price {
  font-weight: 600;
}
</style>
