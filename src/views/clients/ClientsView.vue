<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useClientsStore } from '../../stores/clients'

const store = useClientsStore()
const { clients } = storeToRefs(store)

const form = reactive({
  name: '',
  phone: '',
  email: '',
  addressLine: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  zip: '',
})
const query = ref('')
const filtered = ref([])
const editingId = ref(null)
const editForm = reactive({
  id: '',
  name: '',
  phone: '',
  email: '',
  addressLine: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  zip: '',
})

const states = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
]

onMounted(async () => {
  await store.fetchClients()
  filtered.value = clients.value
})

watch([clients, query], () => {
  const q = query.value.trim().toLowerCase()
  filtered.value = q ? clients.value.filter((c) => c.name.toLowerCase().includes(q)) : clients.value
})

function addClient() {
  if (!form.name) return
  store.addClient({ ...form })
  Object.keys(form).forEach((k) => (form[k] = ''))
}

function startEdit(c) {
  editingId.value = c.id
  Object.assign(editForm, c)
}

async function saveEdit() {
  await store.updateClient({ ...editForm })
  editingId.value = null
}

function cancelEdit() {
  editingId.value = null
}
</script>

<template>
  <section class="stack">
    <header class="row between center">
      <h2>Clientes</h2>
      <input class="search" v-model="query" placeholder="Buscar cliente" />
    </header>

    <form class="grid-form" @submit.prevent="addClient">
      <input v-model="form.name" placeholder="Nome" required />
      <input v-model="form.phone" placeholder="Telefone" />
      <input v-model="form.email" type="email" placeholder="Email" />
      <input v-model="form.addressLine" placeholder="Endereço" />
      <input v-model="form.number" placeholder="Número" />
      <input v-model="form.complement" placeholder="Complemento" />
      <input v-model="form.neighborhood" placeholder="Bairro" />
      <input v-model="form.city" placeholder="Cidade" />
      <select v-model="form.state">
        <option value="">Estado</option>
        <option v-for="uf in states" :key="uf" :value="uf">{{ uf }}</option>
      </select>
      <input v-model="form.zip" placeholder="CEP" />
      <button class="btn primary cadastrar-btn" type="submit">
        <svg
          class="btn-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M12 5v14m-7-7h14" />
        </svg>
        Cadastrar Cliente
      </button>
    </form>

    <ul class="list">
      <li v-for="c in filtered" :key="c.id" class="item">
        <template v-if="editingId === c.id">
          <div class="edit-grid">
            <input v-model="editForm.name" placeholder="Nome" />
            <input v-model="editForm.phone" placeholder="Telefone" />
            <input v-model="editForm.email" placeholder="Email" />
            <input v-model="editForm.addressLine" placeholder="Endereço" />
            <input v-model="editForm.number" placeholder="Número" />
            <input v-model="editForm.complement" placeholder="Complemento" />
            <input v-model="editForm.neighborhood" placeholder="Bairro" />
            <input v-model="editForm.city" placeholder="Cidade" />
            <select v-model="editForm.state">
              <option value="">Estado</option>
              <option v-for="uf in states" :key="uf" :value="uf">{{ uf }}</option>
            </select>
            <input v-model="editForm.zip" placeholder="CEP" />
          </div>
          <div class="actions">
            <button class="btn" @click="cancelEdit" type="button">Cancelar</button>
            <button class="btn primary" @click="saveEdit" type="button">Salvar</button>
          </div>
        </template>
        <template v-else>
          <div>
            <strong>{{ c.name }}</strong>
            <small class="muted">
              — {{ c.phone }} · {{ c.email }}
              <template v-if="c.city || c.state">
                · {{ c.city }} <template v-if="c.state">/{{ c.state }}</template></template
              >
            </small>
          </div>
          <div class="row gap">
            <button class="link" @click="startEdit(c)">editar</button>
            <button class="link danger" @click="store.removeClient(c.id)">remover</button>
          </div>
        </template>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.stack {
  display: grid;
  gap: 1rem;
}
.row {
  display: flex;
  gap: 1rem;
}
.between {
  justify-content: space-between;
}
.center {
  align-items: center;
}
.edit-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 2fr 1fr 1fr 1fr 1fr 1fr 1fr;
  gap: 0.5rem;
  width: 100%;
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

/* Estilo especial para o botão cadastrar */
.cadastrar-btn {
  grid-column: span 2;
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

.cadastrar-btn:hover {
  background: color-mix(in srgb, var(--primary) 90%, black 10%);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
}

.cadastrar-btn:active {
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
.link.danger {
  color: #ef4444;
}
input,
.search {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 0.5rem;
}
.actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
@media (max-width: 720px) {
  .edit-grid {
    grid-template-columns: 1fr;
  }

  .cadastrar-btn {
    grid-column: span 1;
    margin-top: 0.5rem;
  }
}
.list {
  overflow-x: auto;
}
</style>
