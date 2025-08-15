<script setup>
import { storeToRefs } from 'pinia'
import { useAppointmentsStore } from '../../stores/appointments'
import AppointmentCard from '../../components/appointments/AppointmentCard.vue'
import EmptyState from '../../components/EmptyState.vue'

const store = useAppointmentsStore()
const { appointments, loading } = storeToRefs(store)

store.fetchAppointments()
</script>

<template>
  <div class="stack">
    <div v-if="loading">Carregando...</div>
    <EmptyState
      v-else-if="!appointments.length"
      title="Nenhum agendamento"
      description="Crie o primeiro clicando em 'Novo Agendamento'"
    />
    <div v-else class="list">
      <AppointmentCard v-for="a in appointments" :key="a.id" :appointment="a" />
    </div>
  </div>
</template>

<style scoped>
.stack {
  display: grid;
  gap: 1rem;
}
.list {
  display: grid;
  gap: 0.75rem;
}
</style>
