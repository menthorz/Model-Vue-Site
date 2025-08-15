import { defineStore } from 'pinia'
import { ref } from 'vue'
import { clientsApi } from '../utils/api'

export const useClientsStore = defineStore('clients', () => {
  const clients = ref([])

  async function fetchClients() {
    clients.value = await clientsApi.list()
  }

  async function addClient(payload) {
    const created = await clientsApi.create(payload)
    clients.value.unshift(created)
  }

  async function updateClient(payload) {
    const updated = await clientsApi.update(payload.id, payload)
    const idx = clients.value.findIndex((c) => c.id === updated.id)
    if (idx !== -1) clients.value[idx] = updated
  }

  function removeClient(id) {
    clients.value = clients.value.filter((c) => c.id !== id)
    clientsApi.remove(id)
  }

  return { clients, fetchClients, addClient, updateClient, removeClient }
})
