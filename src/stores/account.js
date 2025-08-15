import { defineStore } from 'pinia'
import { ref } from 'vue'
import { clientsApi } from '@/utils/api'

export const useAccountStore = defineStore('account', () => {
  const me = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function load(clientId) {
    if (!clientId) return
    loading.value = true
    error.value = null
    try {
      me.value = await clientsApi.get(clientId)
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function update(payload) {
    if (!me.value?.id) return
    loading.value = true
    error.value = null
    try {
      me.value = await clientsApi.update(me.value.id, payload)
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  return { me, loading, error, load, update }
})
