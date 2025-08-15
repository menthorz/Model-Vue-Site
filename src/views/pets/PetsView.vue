<script setup>
import { onMounted, reactive, computed, nextTick, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { usePetsStore } from '../../stores/pets'
import { useClientsStore } from '../../stores/clients'
import { useToast } from '../../composables/useToast'

const route = useRoute()
const store = usePetsStore()
const { pets } = storeToRefs(store)
const clientsStore = useClientsStore()
const { clients } = storeToRefs(clientsStore)
const toast = useToast()

const form = reactive({ name: '', ownerId: '', breed: '', notes: '' })
const editingId = ref(null)
const editForm = reactive({ id: '', name: '', ownerId: '', breed: '', notes: '' })
const formRef = ref(null)

const isNewMode = computed(() => route.name === 'pets-new')

onMounted(async () => {
  store.fetchPets()
  clientsStore.fetchClients()

  // Se for a rota de novo pet, focar no formulário
  if (isNewMode.value) {
    await nextTick()
    if (formRef.value) {
      formRef.value.scrollIntoView({ behavior: 'smooth', block: 'center' })
      const firstInput = formRef.value.querySelector('input')
      if (firstInput) firstInput.focus()
    }
  }
})

async function addPet() {
  if (!form.name) {
    toast.error('Nome do pet é obrigatório')
    return
  }
  try {
    await store.addPet({ ...form })
    Object.assign(form, { name: '', ownerId: '', breed: '', notes: '' })
    toast.success('Pet cadastrado com sucesso!')
  } catch (error) {
    toast.error('Erro ao cadastrar pet: ' + (error.message || 'Erro desconhecido'))
  }
}

function startEdit(p) {
  editingId.value = p.id
  Object.assign(editForm, p)
}

async function saveEdit() {
  try {
    await store.updatePet({ ...editForm })
    editingId.value = null
    toast.success('Pet atualizado com sucesso!')
  } catch (error) {
    toast.error('Erro ao atualizar pet: ' + (error.message || 'Erro desconhecido'))
  }
}

function cancelEdit() {
  editingId.value = null
}

async function removePet(id) {
  if (!confirm('Tem certeza que deseja remover este pet?')) return
  try {
    await store.removePet(id)
    toast.success('Pet removido com sucesso!')
  } catch (error) {
    toast.error('Erro ao remover pet: ' + (error.message || 'Erro desconhecido'))
  }
}
</script>

<template>
  <section class="pets-container">
    <header class="page-header">
      <h2>
        <svg
          class="page-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="11" cy="4" r="2" />
          <circle cx="18" cy="8" r="2" />
          <path d="m11 6-4 6h6l-2-6z" />
          <path d="M17 8h2l-4 8h-4" />
        </svg>
        Gestão de Pets
      </h2>
      <p class="page-description">Cadastre e gerencie os pets dos seus clientes</p>
    </header>

    <div ref="formRef" class="form-section" :class="{ 'highlight-new': isNewMode }">
      <div class="form-header">
        <h3 v-if="isNewMode">
          <svg
            class="form-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M12 5v14m-7-7h14" />
          </svg>
          Cadastrar Novo Pet
        </h3>
        <h3 v-else>
          <svg
            class="form-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M12 5v14m-7-7h14" />
          </svg>
          Adicionar Pet
        </h3>
      </div>

      <form class="pet-form" @submit.prevent="addPet">
        <div class="form-grid">
          <div class="form-group">
            <label for="pet-name">Nome do Pet *</label>
            <input
              id="pet-name"
              v-model="form.name"
              placeholder="Ex: Rex, Mia, Luna..."
              required
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="pet-owner">Tutor</label>
            <select id="pet-owner" v-model="form.ownerId" class="form-select">
              <option value="">Sem tutor cadastrado</option>
              <option v-for="c in clients" :key="c.id" :value="c.id">
                {{ c.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="pet-breed">Raça</label>
            <input
              id="pet-breed"
              v-model="form.breed"
              placeholder="Ex: Golden Retriever, SRD..."
              class="form-input"
            />
          </div>

          <div class="form-group full-width">
            <label for="pet-notes">Observações</label>
            <textarea
              id="pet-notes"
              v-model="form.notes"
              placeholder="Informações importantes sobre o pet..."
              class="form-textarea"
              rows="3"
            />
          </div>
        </div>

        <button type="submit" class="btn primary">
          <svg
            class="btn-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="11" cy="4" r="2" />
            <circle cx="18" cy="8" r="2" />
            <path d="m11 6-4 6h6l-2-6z" />
            <path d="M17 8h2l-4 8h-4" />
          </svg>
          Cadastrar Pet
        </button>
      </form>
    </div>

    <div class="pets-list">
      <div class="list-header">
        <h3>Pets Cadastrados ({{ pets.length }})</h3>
      </div>

      <div v-if="pets.length === 0" class="empty-state">
        <svg
          class="empty-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <circle cx="11" cy="4" r="2" />
          <circle cx="18" cy="8" r="2" />
          <path d="m11 6-4 6h6l-2-6z" />
          <path d="M17 8h2l-4 8h-4" />
        </svg>
        <h4>Nenhum pet cadastrado</h4>
        <p>Comece cadastrando o primeiro pet no formulário acima</p>
      </div>

      <div v-else class="pets-grid">
        <article
          v-for="pet in pets"
          :key="pet.id"
          class="pet-card"
          :class="{ editing: editingId === pet.id }"
        >
          <div v-if="editingId === pet.id" class="edit-form">
            <div class="edit-header">
              <h4>Editando: {{ pet.name }}</h4>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label>Nome</label>
                <input v-model="editForm.name" class="form-input" />
              </div>

              <div class="form-group">
                <label>Tutor</label>
                <select v-model="editForm.ownerId" class="form-select">
                  <option value="">Sem tutor</option>
                  <option v-for="c in clients" :key="c.id" :value="c.id">
                    {{ c.name }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label>Raça</label>
                <input v-model="editForm.breed" class="form-input" />
              </div>

              <div class="form-group full-width">
                <label>Observações</label>
                <textarea v-model="editForm.notes" class="form-textarea" rows="2" />
              </div>
            </div>

            <div class="edit-actions">
              <button @click="saveEdit" class="btn primary small">
                <svg
                  class="btn-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17,21 17,13 7,13 7,21" />
                  <polyline points="7,3 7,8 15,8" />
                </svg>
                Salvar
              </button>
              <button @click="cancelEdit" class="btn secondary small">
                <svg
                  class="btn-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                Cancelar
              </button>
            </div>
          </div>

          <div v-else class="pet-info">
            <div class="pet-header">
              <h4 class="pet-name">{{ pet.name }}</h4>
              <div class="pet-actions">
                <button @click="startEdit(pet)" class="btn secondary small">
                  <svg
                    class="btn-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Editar
                </button>
                <button @click="removePet(pet.id)" class="btn danger small">
                  <svg
                    class="btn-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <polyline points="3,6 5,6 21,6" />
                    <path
                      d="m19,6-1,14a2,2 0 0,1-2,2H8a2,2 0 0,1-2-2L5,6m5,0V4a2,2 0 0,1 2-2h0a2,2 0 0,1 2,2v2"
                    />
                  </svg>
                  Remover
                </button>
              </div>
            </div>

            <div class="pet-details">
              <div v-if="pet.ownerName" class="detail-item">
                <span class="detail-label">Tutor:</span>
                <span class="detail-value">{{ pet.ownerName }}</span>
              </div>

              <div v-if="pet.breed" class="detail-item">
                <span class="detail-label">Raça:</span>
                <span class="detail-value">{{ pet.breed }}</span>
              </div>

              <div v-if="pet.notes" class="detail-item">
                <span class="detail-label">Observações:</span>
                <span class="detail-value">{{ pet.notes }}</span>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pets-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-header h2 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: var(--text);
}

.page-icon {
  width: 2rem;
  height: 2rem;
  color: var(--primary);
}

.page-description {
  color: var(--muted);
  font-size: 1.125rem;
  margin: 0;
}

.form-section {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 3rem;
  transition: all 0.3s ease;
}

.form-section.highlight-new {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 20%, transparent);
}

.form-header h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  color: var(--text);
}

.form-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--primary);
}

.pet-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-weight: 500;
  color: var(--text);
  font-size: 0.875rem;
}

.form-input,
.form-select,
.form-textarea {
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
  color: var(--text);
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.form-select {
  /* Mantém aparência nativa do sistema, apenas ajusta sutilmente */
  cursor: pointer;
  font-family: inherit;
  line-height: 1.5;
}

.form-select:hover {
  border-color: var(--primary);
  background-color: color-mix(in srgb, var(--surface) 95%, var(--primary) 5%);
}

.form-select:focus {
  border-color: var(--primary);
  background-color: var(--surface);
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 20%, transparent);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.pets-list {
  margin-bottom: 2rem;
}

.list-header {
  margin-bottom: 1.5rem;
}

.list-header h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: var(--text);
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--muted);
}

.empty-icon {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1rem;
  color: var(--muted);
  opacity: 0.5;
}

.empty-state h4 {
  margin: 0 0 0.5rem 0;
  color: var(--text);
}

.empty-state p {
  margin: 0;
}

.pets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.pet-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s ease;
}

.pet-card:hover:not(.editing) {
  border-color: var(--primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.pet-card.editing {
  border-color: var(--warning);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--warning) 20%, transparent);
}

.pet-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.pet-name {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: var(--text);
}

.pet-actions {
  display: flex;
  gap: 0.5rem;
}

.pet-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.detail-label {
  font-weight: 500;
  color: var(--muted);
  min-width: 80px;
  font-size: 0.875rem;
}

.detail-value {
  color: var(--text);
  flex: 1;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.edit-header h4 {
  margin: 0;
  color: var(--warning);
  font-size: 1.125rem;
}

.edit-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  font-size: 1rem;
}

.btn.small {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.btn.primary {
  background: var(--primary);
  color: white;
}

.btn.primary:hover {
  background: color-mix(in srgb, var(--primary) 85%, black 15%);
}

.btn.secondary {
  background: var(--bg);
  color: var(--text);
  border: 1px solid var(--border);
}

.btn.secondary:hover {
  background: var(--surface);
  border-color: var(--primary);
}

.btn.danger {
  background: var(--danger);
  color: white;
}

.btn.danger:hover {
  background: color-mix(in srgb, var(--danger) 85%, black 15%);
}

.btn-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

/* Ícones se adaptam ao tema */
.page-icon,
.form-icon,
.btn-icon {
  transition: color 0.2s ease;
}

/* Tema claro - garante que os ícones sejam visíveis */
:root .page-icon,
:root .form-icon {
  color: var(--primary);
}

:root .empty-icon {
  opacity: 0.4;
}

/* Tema escuro - alguns ícones ficam mais suaves */
[data-theme='dark'] .empty-icon {
  opacity: 0.3;
}

[data-theme='dark'] .page-icon {
  color: var(--primary);
  filter: brightness(1.1);
}

[data-theme='dark'] .form-icon {
  color: var(--primary);
  filter: brightness(1.1);
}

@media (max-width: 768px) {
  .pets-container {
    padding: 1rem;
  }

  .page-header h2 {
    font-size: 1.75rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .pets-grid {
    grid-template-columns: 1fr;
  }

  .pet-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .pet-actions {
    justify-content: stretch;
  }

  .btn {
    flex: 1;
    justify-content: center;
  }
}
</style>
