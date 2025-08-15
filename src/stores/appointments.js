import { defineStore } from 'pinia'
import { ref } from 'vue'
import { appointmentsApi } from '../utils/api'

export const useAppointmentsStore = defineStore('appointments', () => {
  const appointments = ref([])
  const current = ref(null)
  const loading = ref(false)

  async function fetchAppointments() {
    loading.value = true
    try {
      appointments.value = await appointmentsApi.list()
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id) {
    loading.value = true
    try {
      current.value = await appointmentsApi.get(id)
    } finally {
      loading.value = false
    }
  }

  async function createAppointment(payload) {
    loading.value = true
    try {
      const created = await appointmentsApi.create(payload)
      appointments.value.unshift(created)
      return created
    } finally {
      loading.value = false
    }
  }

  async function updateAppointment(payload) {
    loading.value = true
    try {
      const updated = await appointmentsApi.update(payload.id, payload)
      const idx = appointments.value.findIndex((a) => a.id === payload.id)
      if (idx !== -1) appointments.value[idx] = updated
      return updated
    } finally {
      loading.value = false
    }
  }

  async function cancelAppointment(id, reason = '') {
    loading.value = true
    try {
      const updated = await appointmentsApi.cancel(id, reason)
      const idx = appointments.value.findIndex((a) => a.id === id)
      if (idx !== -1) appointments.value[idx] = updated
      return updated
    } finally {
      loading.value = false
    }
  }

  return {
    appointments,
    current,
    loading,
    fetchAppointments,
    fetchById,
    createAppointment,
    updateAppointment,
    cancelAppointment,
  }
})
