import { defineStore } from 'pinia'
import { ref } from 'vue'
import { petsApi } from '../utils/api'

export const usePetsStore = defineStore('pets', () => {
  const pets = ref([])

  async function fetchPets() {
    pets.value = await petsApi.list()
  }

  async function addPet(payload) {
    const created = await petsApi.create(payload)
    pets.value.unshift(created)
  }

  async function updatePet(payload) {
    const updated = await petsApi.update(payload.id, payload)
    const idx = pets.value.findIndex((p) => p.id === updated.id)
    if (idx !== -1) pets.value[idx] = updated
  }

  function removePet(id) {
    pets.value = pets.value.filter((p) => p.id !== id)
    petsApi.remove(id)
  }

  return { pets, fetchPets, addPet, updatePet, removePet }
})
