import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  const storeInfo = ref({
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

  const loading = ref(false)

  // Load settings from localStorage
  function loadSettings() {
    const saved = localStorage.getItem('petshop_settings')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        storeInfo.value = { ...storeInfo.value, ...parsed }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error)
      }
    }
  }

  // Save settings to localStorage
  function saveSettings(newSettings) {
    loading.value = true
    try {
      storeInfo.value = { ...storeInfo.value, ...newSettings }
      localStorage.setItem('petshop_settings', JSON.stringify(storeInfo.value))
      return Promise.resolve()
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
      return Promise.reject(error)
    } finally {
      loading.value = false
    }
  }

  // Initialize settings on store creation
  loadSettings()

  return {
    storeInfo,
    loading,
    loadSettings,
    saveSettings,
  }
})
