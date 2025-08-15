<script setup>
import { onMounted, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useServicesStore } from '../../stores/services'

const store = useServicesStore()
const { services } = storeToRefs(store)

const form = reactive({ name: '', duration: 60, price: 0 })

onMounted(() => store.fetchServices())

function addService() {
  if (!form.name) return
  store.addService({ ...form })
  form.name = ''
  form.duration = 60
  form.price = 0
}
</script>

<template>
  <section class="stack">
    <h2>Serviços</h2>

    <form class="grid-form" @submit.prevent="addService">
      <input v-model="form.name" placeholder="Nome" required />
      <input
        type="number"
        v-model.number="form.duration"
        placeholder="Duração (min)"
        min="15"
        step="15"
      />
      <input
        type="number"
        v-model.number="form.price"
        placeholder="Preço (R$)"
        min="0"
        step="0.01"
      />
      <button class="btn primary adicionar-btn" type="submit">
        <svg
          class="btn-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M12 5v14m-7-7h14" />
        </svg>
        Adicionar Serviço
      </button>
    </form>

    <ul class="list">
      <li v-for="s in services" :key="s.id" class="item">
        <div>
          <strong>{{ s.name }}</strong>
          <small class="muted"> — {{ s.duration }}min · R$ {{ s.price.toFixed(2) }}</small>
        </div>
        <button class="link" @click="store.removeService(s.id)">remover</button>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.stack {
  display: grid;
  gap: 1rem;
}
.grid-form {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 0.5rem;
  align-items: end;
}
.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.5rem;
}
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
}
.muted {
  color: #6b7280;
}
.btn {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn.primary {
  background: #2563eb;
  border-color: #1d4ed8;
  color: #fff;
}

.btn.primary:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
}

/* Estilo especial para o botão adicionar */
.adicionar-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1rem;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 8px;
  background: var(--primary);
  border: none;
  color: white;
  box-shadow: 0 1px 3px rgba(37, 99, 235, 0.2);
  transition: all 0.2s ease;
}

.adicionar-btn:hover {
  background: color-mix(in srgb, var(--primary) 90%, black 10%);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
}

.adicionar-btn:active {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(37, 99, 235, 0.2);
}

.btn-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.link {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
}
input {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 0.5rem;
}

@media (max-width: 720px) {
  .grid-form {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .adicionar-btn {
    margin-top: 0.5rem;
  }
}
</style>
