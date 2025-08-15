import { defineStore } from 'pinia'
import { ref } from 'vue'
import { servicesApi } from '../utils/api'

export const useServicesStore = defineStore('services', () => {
  const services = ref([])

  async function fetchServices() {
    services.value = await servicesApi.list()
  }

  async function addService(payload) {
    const created = await servicesApi.create(payload)
    services.value.unshift(created)
  }

  function removeService(id) {
    services.value = services.value.filter((s) => s.id !== id)
    servicesApi.remove(id)
  }

  return { services, fetchServices, addService, removeService }
})
