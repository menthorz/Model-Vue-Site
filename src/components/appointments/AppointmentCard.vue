<script setup>
import { RouterLink } from 'vue-router'
import { useAppointmentsStore } from '@/stores/appointments'
import { useToast } from '@/composables/useToast'

defineProps({
  appointment: {
    type: Object,
    required: true,
  },
})

const store = useAppointmentsStore()
const toast = useToast()

async function cancel(appointment) {
  if (!confirm('Cancelar este agendamento?')) return
  const reason = prompt('Motivo do cancelamento (opcional):') || ''
  try {
    await store.cancelAppointment(appointment.id, reason)
    toast.success('Agendamento cancelado com sucesso!')
  } catch (error) {
    toast.error('Erro ao cancelar agendamento: ' + (error.message || 'Erro desconhecido'))
  }
}
</script>

<template>
  <article class="appointment-card" :class="{ cancelled: appointment.status === 'cancelled' }">
    <div class="card-header">
      <div class="pet-info">
        <h3 class="pet-name">{{ appointment.petName }}</h3>
        <span v-if="appointment.status === 'cancelled'" class="status-badge cancelled">
          <i class="icon">✕</i>
          Cancelado
        </span>
      </div>
      <div class="appointment-time">
        <time :datetime="appointment.date">
          {{
            new Date(appointment.date).toLocaleDateString('pt-BR', {
              weekday: 'short',
              day: '2-digit',
              month: 'short',
            })
          }}
        </time>
        <time :datetime="appointment.date" class="time">
          {{
            new Date(appointment.date).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            })
          }}
        </time>
      </div>
    </div>

    <div class="card-body">
      <div class="service-info">
        <i class="service-icon">✂️</i>
        <span class="service-name">{{ appointment.serviceName }}</span>
      </div>
      <p v-if="appointment.notes" class="notes">{{ appointment.notes }}</p>
      <p v-if="appointment.cancelReason" class="cancel-reason">
        <strong>Motivo:</strong> {{ appointment.cancelReason }}
      </p>
    </div>

    <footer class="card-actions">
      <RouterLink
        v-if="appointment.status !== 'cancelled'"
        class="btn secondary"
        :to="`/agendamentos/${appointment.id}/editar`"
      >
        <i class="icon">📝</i>
        Editar
      </RouterLink>
      <button
        v-if="appointment.status !== 'cancelled'"
        class="btn danger"
        @click="cancel(appointment)"
      >
        <i class="icon">🗑️</i>
        Cancelar
      </button>
      <span v-else class="cancelled-date">
        Cancelado em {{ new Date(appointment.cancelledAt).toLocaleDateString('pt-BR') }}
      </span>
    </footer>
  </article>
</template>

<style scoped>
.appointment-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.appointment-card:hover:not(.cancelled) {
  border-color: var(--primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.appointment-card.cancelled {
  background: color-mix(in srgb, var(--surface) 90%, var(--muted) 10%);
  border-color: var(--muted);
  opacity: 0.8;
}

.appointment-card.cancelled::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: var(--danger);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.pet-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.pet-name {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text);
}

.appointment-time {
  text-align: right;
  font-size: 0.875rem;
  color: var(--muted);
}

.appointment-time .time {
  display: block;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
  margin-top: 0.25rem;
}

.card-body {
  margin-bottom: 1.5rem;
}

.service-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.service-icon {
  font-size: 1.25rem;
}

.service-name {
  font-weight: 500;
  color: var(--text);
}

.notes {
  background: var(--bg);
  padding: 0.75rem;
  border-radius: 8px;
  margin: 0.75rem 0;
  font-style: italic;
  color: var(--muted);
  border-left: 3px solid var(--primary);
}

.cancel-reason {
  background: color-mix(in srgb, var(--danger) 10%, var(--surface));
  padding: 0.75rem;
  border-radius: 8px;
  margin: 0.75rem 0;
  color: var(--danger);
  border-left: 3px solid var(--danger);
}

.card-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.cancelled-date {
  font-size: 0.875rem;
  color: var(--muted);
  font-style: italic;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: var(--danger);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 16px;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.status-badge .icon {
  font-size: 0.875rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
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

.btn .icon {
  font-size: 0.875rem;
}
</style>
