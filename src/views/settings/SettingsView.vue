<script setup>
import { reactive } from 'vue'
import { useSettingsStore } from '../../stores/settings'
import { useToast } from '../../composables/useToast'

const store = useSettingsStore()
const toast = useToast()

// Form state
const form = reactive({
  name: store.storeInfo.name,
  cnpj: store.storeInfo.cnpj,
  phone: store.storeInfo.phone,
  whatsapp: store.storeInfo.whatsapp,
  email: store.storeInfo.email,
  addressLine: store.storeInfo.addressLine,
  number: store.storeInfo.number,
  complement: store.storeInfo.complement,
  neighborhood: store.storeInfo.neighborhood,
  city: store.storeInfo.city,
  state: store.storeInfo.state,
  zip: store.storeInfo.zip,
  businessHours: { ...store.storeInfo.businessHours },
  socialMedia: { ...store.storeInfo.socialMedia },
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

async function saveSettings() {
  if (!form.name || !form.email) {
    toast.error('Nome da loja e email são obrigatórios')
    return
  }

  try {
    await store.saveSettings(form)
    toast.success('Configurações salvas com sucesso!')
  } catch (error) {
    toast.error('Erro ao salvar configurações: ' + (error.message || 'Erro desconhecido'))
  }
}

function resetToDefaults() {
  if (!confirm('Tem certeza que deseja restaurar as configurações padrão?')) return

  Object.assign(form, {
    name: 'PetShop',
    cnpj: '12.345.678/0001-90',
    phone: '(11) 3000-0000',
    whatsapp: '(11) 98000-0000',
    email: 'contato@petshop.com.br',
    addressLine: 'Rua Exemplo',
    number: '123',
    complement: '',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    zip: '01000-000',
    businessHours: {
      weekdays: '08:00–18:00',
      saturday: '09:00–14:00',
      sunday: 'Fechado',
    },
    socialMedia: {
      facebook: '',
      instagram: '',
      website: '',
    },
  })

  toast.info('Configurações restauradas. Clique em "Salvar" para confirmar.')
}
</script>

<template>
  <section class="settings-container">
    <header class="page-header">
      <h2>
        <svg
          class="page-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
          />
          <circle cx="12" cy="12" r="3" />
        </svg>
        Configurações da Loja
      </h2>
      <p class="page-description">
        Gerencie as informações que aparecem no footer e contatos da loja
      </p>
    </header>

    <form @submit.prevent="saveSettings" class="settings-form">
      <!-- Informações Básicas -->
      <div class="form-section">
        <h3 class="section-title">
          <svg
            class="section-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M20 7h-9" />
            <path d="M14 17H5" />
            <path d="M17 12H5" />
          </svg>
          Informações Básicas
        </h3>

        <div class="form-grid">
          <div class="form-group">
            <label for="store-name">Nome da Loja *</label>
            <input
              id="store-name"
              v-model="form.name"
              placeholder="Ex: PetShop Premium"
              required
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="store-cnpj">CNPJ</label>
            <input
              id="store-cnpj"
              v-model="form.cnpj"
              placeholder="00.000.000/0000-00"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="store-email">Email *</label>
            <input
              id="store-email"
              v-model="form.email"
              type="email"
              placeholder="contato@petshop.com.br"
              required
              class="form-input"
            />
          </div>
        </div>
      </div>

      <!-- Contato -->
      <div class="form-section">
        <h3 class="section-title">
          <svg
            class="section-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
            />
          </svg>
          Contato
        </h3>

        <div class="form-grid">
          <div class="form-group">
            <label for="store-phone">Telefone</label>
            <input
              id="store-phone"
              v-model="form.phone"
              placeholder="(11) 3000-0000"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="store-whatsapp">WhatsApp</label>
            <input
              id="store-whatsapp"
              v-model="form.whatsapp"
              placeholder="(11) 98000-0000"
              class="form-input"
            />
          </div>
        </div>
      </div>

      <!-- Endereço -->
      <div class="form-section">
        <h3 class="section-title">
          <svg
            class="section-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          Endereço
        </h3>

        <div class="form-grid">
          <div class="form-group span-2">
            <label for="store-address">Rua/Avenida</label>
            <input
              id="store-address"
              v-model="form.addressLine"
              placeholder="Rua das Flores"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="store-number">Número</label>
            <input id="store-number" v-model="form.number" placeholder="123" class="form-input" />
          </div>

          <div class="form-group">
            <label for="store-complement">Complemento</label>
            <input
              id="store-complement"
              v-model="form.complement"
              placeholder="Sala 101"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="store-neighborhood">Bairro</label>
            <input
              id="store-neighborhood"
              v-model="form.neighborhood"
              placeholder="Centro"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="store-city">Cidade</label>
            <input id="store-city" v-model="form.city" placeholder="São Paulo" class="form-input" />
          </div>

          <div class="form-group">
            <label for="store-state">Estado</label>
            <select id="store-state" v-model="form.state" class="form-select">
              <option value="">Selecione o estado</option>
              <option v-for="uf in states" :key="uf" :value="uf">{{ uf }}</option>
            </select>
          </div>

          <div class="form-group">
            <label for="store-zip">CEP</label>
            <input id="store-zip" v-model="form.zip" placeholder="01000-000" class="form-input" />
          </div>
        </div>
      </div>

      <!-- Horário de Funcionamento -->
      <div class="form-section">
        <h3 class="section-title">
          <svg
            class="section-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12,6 12,12 16,14" />
          </svg>
          Horário de Funcionamento
        </h3>

        <div class="form-grid">
          <div class="form-group">
            <label for="hours-weekdays">Segunda a Sexta</label>
            <input
              id="hours-weekdays"
              v-model="form.businessHours.weekdays"
              placeholder="08:00–18:00"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="hours-saturday">Sábado</label>
            <input
              id="hours-saturday"
              v-model="form.businessHours.saturday"
              placeholder="09:00–14:00"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="hours-sunday">Domingo</label>
            <input
              id="hours-sunday"
              v-model="form.businessHours.sunday"
              placeholder="Fechado"
              class="form-input"
            />
          </div>
        </div>
      </div>

      <!-- Redes Sociais -->
      <div class="form-section">
        <h3 class="section-title">
          <svg
            class="section-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
          </svg>
          Redes Sociais
        </h3>

        <div class="form-grid">
          <div class="form-group">
            <label for="social-facebook">Facebook</label>
            <input
              id="social-facebook"
              v-model="form.socialMedia.facebook"
              placeholder="https://facebook.com/petshop"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="social-instagram">Instagram</label>
            <input
              id="social-instagram"
              v-model="form.socialMedia.instagram"
              placeholder="https://instagram.com/petshop"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="social-website">Website</label>
            <input
              id="social-website"
              v-model="form.socialMedia.website"
              placeholder="https://petshop.com.br"
              class="form-input"
            />
          </div>
        </div>
      </div>

      <!-- Ações -->
      <div class="form-actions">
        <button type="button" @click="resetToDefaults" class="btn secondary">
          <svg
            class="btn-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          Restaurar Padrão
        </button>

        <button type="submit" class="btn primary" :disabled="store.loading">
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
          {{ store.loading ? 'Salvando...' : 'Salvar Configurações' }}
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.settings-container {
  max-width: 900px;
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

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 2rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  color: var(--text);
}

.section-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--primary);
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

.form-group.span-2 {
  grid-column: span 2;
}

.form-group label {
  font-weight: 500;
  color: var(--text);
  font-size: 0.875rem;
}

.form-input,
.form-select {
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
  color: var(--text);
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.form-select {
  cursor: pointer;
  font-family: inherit;
  line-height: 1.5;
}

.form-select:hover {
  border-color: var(--primary);
  background-color: color-mix(in srgb, var(--surface) 95%, var(--primary) 5%);
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 20%, transparent);
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 2rem 0;
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

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.btn.primary {
  background: var(--primary);
  color: white;
}

.btn.primary:hover:not(:disabled) {
  background: color-mix(in srgb, var(--primary) 85%, black 15%);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
}

.btn.secondary {
  background: var(--bg);
  color: var(--text);
  border: 1px solid var(--border);
}

.btn.secondary:hover {
  background: var(--surface);
  border-color: var(--primary);
  transform: translateY(-1px);
}

.btn-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .settings-container {
    padding: 1rem;
  }

  .page-header h2 {
    font-size: 1.75rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-group.span-2 {
    grid-column: span 1;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    justify-content: center;
  }
}
</style>
