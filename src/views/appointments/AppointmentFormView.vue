<script setup>
import { computed, onMounted, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAppointmentsStore } from '../../stores/appointments'
import { usePetsStore } from '../../stores/pets'
import { useServicesStore } from '../../stores/services'
import { useToast } from '../../composables/useToast'
import { useFormValidation } from '../../composables/useFormValidation'

const route = useRoute()
const router = useRouter()
const appointments = useAppointmentsStore()
const pets = usePetsStore()
const services = useServicesStore()
const toast = useToast()

const { current, loading } = storeToRefs(appointments)
const { validateForm, validateField, hasError, getError, clearErrors, rules } = useFormValidation()

const form = reactive({
  id: null,
  petId: '',
  date: '',
  serviceId: '',
  notes: '',
})

const validationSchema = {
  petId: [rules.required],
  date: [rules.required, rules.futureDate, rules.businessHours],
  serviceId: [rules.required],
  notes: [rules.maxLength(500)],
}

const isEdit = computed(() => Boolean(route.params.id))

// Watch form fields for real-time validation
watch(
  () => form.petId,
  (value) => validateField('petId', value, validationSchema.petId),
)
watch(
  () => form.date,
  (value) => validateField('date', value, validationSchema.date),
)
watch(
  () => form.serviceId,
  (value) => validateField('serviceId', value, validationSchema.serviceId),
)
watch(
  () => form.notes,
  (value) => validateField('notes', value, validationSchema.notes),
)

onMounted(async () => {
  await Promise.all([pets.fetchPets(), services.fetchServices()])
  if (isEdit.value) {
    await appointments.fetchById(route.params.id)
    Object.assign(form, {
      id: current.value.id,
      petId: current.value.petId,
      date: current.value.date.slice(0, 16),
      serviceId: current.value.serviceId,
      notes: current.value.notes || '',
    })
  } else if (route.query.date) {
    // Prefill when coming from calendar slot click
    try {
      const d = new Date(String(route.query.date))
      if (!isNaN(d)) form.date = d.toISOString().slice(0, 16)
    } catch {
      // ignore invalid prefill
    }
  }
  clearErrors()
})

async function save() {
  // Validate form before submission
  if (!validateForm(form, validationSchema)) {
    toast.error('Por favor, corrija os erros no formulário')
    return
  }

  // Ensure latest appointments for conflict check
  await appointments.fetchAppointments()
  const selected = new Date(form.date)
  const duration = getServiceDuration(form.serviceId)
  const err = validateBusinessRules(selected, duration, isEdit.value ? form.id : null)
  if (err) {
    toast.error(err)
    return
  }
  const payload = { ...form, date: selected.toISOString() }
  try {
    if (isEdit.value) {
      await appointments.updateAppointment(payload)
      toast.success('Agendamento atualizado com sucesso!')
    } else {
      await appointments.createAppointment(payload)
      toast.success('Agendamento criado com sucesso!')
    }
    router.push('/agendamentos')
  } catch (e) {
    // backend validation fallback
    toast.error(e?.message || 'Não foi possível salvar o agendamento.')
  }
}

// --- Local validation helpers (mirror API rules) ---
const OPEN_MIN = 8 * 60
const CLOSE_MIN = 18 * 60
function getServiceDuration(serviceId) {
  const s = services.services.find((x) => String(x.id) === String(serviceId))
  return s?.duration || 60
}
function toMinutes(d) {
  return d.getHours() * 60 + d.getMinutes()
}
function addMinutes(d, mins) {
  const x = new Date(d)
  x.setMinutes(x.getMinutes() + mins)
  return x
}
function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && aEnd > bStart
}
function validateBusinessRules(startDate, durationMin, ignoreId) {
  // Past
  if (startDate.getTime() < Date.now()) {
    return 'Não é possível agendar no passado.'
  }
  // Business hours
  const startMin = toMinutes(startDate)
  const endMin = startMin + durationMin
  if (startMin < OPEN_MIN || endMin > CLOSE_MIN) {
    return 'Horário fora do expediente (08:00–18:00).'
  }
  // Overlap
  const endDate = addMinutes(startDate, durationMin)
  for (const a of appointments.appointments) {
    if (ignoreId && String(a.id) === String(ignoreId)) continue
    const aStart = new Date(a.date)
    const aEnd = addMinutes(aStart, getServiceDuration(a.serviceId))
    if (overlaps(startDate, endDate, aStart, aEnd)) {
      return 'Já existe um agendamento que conflita com este horário.'
    }
  }
  return ''
}
</script>

<template>
  <form class="form" @submit.prevent="save">
    <div class="field">
      <label>Pet</label>
      <select v-model="form.petId" required :class="{ error: hasError('petId') }">
        <option disabled value="">Selecione um pet</option>
        <option v-for="p in pets.pets" :key="p.id" :value="p.id">{{ p.name }}</option>
      </select>
      <span v-if="hasError('petId')" class="error-text">{{ getError('petId') }}</span>
    </div>

    <div class="field">
      <label>Data</label>
      <input
        type="datetime-local"
        v-model="form.date"
        required
        :class="{ error: hasError('date') }"
      />
      <span v-if="hasError('date')" class="error-text">{{ getError('date') }}</span>
    </div>

    <div class="field">
      <label>Serviço</label>
      <select v-model="form.serviceId" required :class="{ error: hasError('serviceId') }">
        <option disabled value="">Selecione um serviço</option>
        <option v-for="s in services.services" :key="s.id" :value="s.id">{{ s.name }}</option>
      </select>
      <span v-if="hasError('serviceId')" class="error-text">{{ getError('serviceId') }}</span>
    </div>

    <div class="field">
      <label>Observações</label>
      <textarea
        v-model="form.notes"
        rows="3"
        placeholder="Observações"
        :class="{ error: hasError('notes') }"
      ></textarea>
      <span v-if="hasError('notes')" class="error-text">{{ getError('notes') }}</span>
      <small class="field-hint">Máximo 500 caracteres</small>
    </div>

    <div class="actions">
      <button type="button" class="btn ghost" @click="router.back()">Cancelar</button>
      <button type="submit" class="btn primary" :disabled="loading">Salvar</button>
    </div>
  </form>
</template>

<style scoped>
.form {
  display: grid;
  gap: 1rem;
  max-width: 640px;
}
.field {
  display: grid;
  gap: 0.25rem;
}
input,
select,
textarea {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.5rem;
  transition: border-color 0.2s;
}
input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}
input.error,
select.error,
textarea.error {
  border-color: var(--danger);
}
.error-text {
  color: var(--danger);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
.field-hint {
  color: var(--muted);
  font-size: 0.875rem;
}
.actions {
  display: flex;
  gap: 0.5rem;
}
.btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}
.btn.primary {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
}
.btn.primary:hover:not(:disabled) {
  background: color-mix(in srgb, var(--primary) 90%, black 10%);
  transform: translateY(-1px);
}
.btn.ghost {
  background: transparent;
}
.btn.ghost:hover {
  background: var(--surface-hover);
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}
</style>
