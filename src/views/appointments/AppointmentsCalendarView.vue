<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAppointmentsStore } from '@/stores/appointments'
import { useServicesStore } from '@/stores/services'

const router = useRouter()
const apptsStore = useAppointmentsStore()
const servicesStore = useServicesStore()
const { appointments } = storeToRefs(apptsStore)

// Scroll and time tracking
const scroller = ref(null)
const now = ref(new Date())

onMounted(async () => {
  await Promise.all([apptsStore.fetchAppointments(), servicesStore.fetchServices()])
  const tick = () => (now.value = new Date())
  const id = setInterval(tick, 60_000)
  tick()
  requestAnimationFrame(() => scrollToNow())
  onUnmounted(() => clearInterval(id))
})

// Business hours 08:00-18:00, 30-min slots
const openingHour = 8
const closingHour = 18
const slotsPerHour = 2 // 30 min
const totalSlots = (closingHour - openingHour) * slotsPerHour // 20
const minutesPerDay = (closingHour - openingHour) * 60

// Week navigation (Mon-Sun)
const today = new Date()
const weekStart = ref(startOfWeek(today))

function startOfWeek(d) {
  const x = new Date(d)
  const day = x.getDay() // 0 Sun .. 6 Sat
  const diff = (day === 0 ? -6 : 1) - day // back to Monday
  x.setDate(x.getDate() + diff)
  x.setHours(0, 0, 0, 0)
  return x
}
function addDays(d, n) {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}
function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

const days = computed(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart.value, i)))
const title = computed(() => {
  const start = days.value[0]
  const end = days.value[6]
  const opts = { day: '2-digit', month: 'short' }
  return `${start.toLocaleDateString('pt-BR', opts)} — ${end.toLocaleDateString('pt-BR', opts)}`
})

const hours = computed(() =>
  Array.from({ length: closingHour - openingHour + 1 }, (_, i) => openingHour + i),
)

function dayAppointments(dayDate) {
  return appointments.value.filter((a) => isSameDay(new Date(a.date), dayDate))
}

function durationFor(appt) {
  const s = servicesStore.services.find((x) => String(x.id) === String(appt.serviceId))
  return s?.duration || 60
}

function slotFor(dateStr) {
  const d = new Date(dateStr)
  const minutesFromOpen = d.getHours() * 60 + d.getMinutes() - openingHour * 60
  const start = Math.max(0, Math.floor(minutesFromOpen / 30) + 1)
  return start
}

function spanFor(appt) {
  return Math.max(1, Math.round(durationFor(appt) / 30))
}

function edit(appt) {
  router.push({ name: 'appointment-edit', params: { id: appt.id } })
}

function slotClick(dayDate, slotIndex) {
  const minutes = openingHour * 60 + (slotIndex - 1) * 30
  const d = new Date(dayDate)
  d.setHours(0, 0, 0, 0)
  d.setMinutes(minutes)
  if (d.getTime() < Date.now()) return // block past
  router.push({ name: 'appointment-new', query: { date: d.toISOString() } })
}

const nowPercent = computed(() => {
  const m = now.value.getHours() * 60 + now.value.getMinutes()
  const fromOpen = m - openingHour * 60
  const pct = (fromOpen / minutesPerDay) * 100
  return Math.max(0, Math.min(100, pct))
})

function scrollToNow() {
  if (!scroller.value) return
  const m = now.value.getHours() * 60 + now.value.getMinutes()
  const fromOpen = m - openingHour * 60
  if (fromOpen < 0 || fromOpen > minutesPerDay) return
  const pct = fromOpen / minutesPerDay
  const target = scroller.value.scrollHeight * pct - scroller.value.clientHeight * 0.4
  scroller.value.scrollTop = Math.max(0, target)
}
</script>

<template>
  <section class="stack">
    <header class="row between center wrap">
      <div class="row gap center">
        <button class="btn" @click="weekStart = addDays(weekStart, -7)">◀ Semana</button>
        <button class="btn" @click="weekStart = startOfWeek(new Date())">Hoje</button>
        <button class="btn" @click="weekStart = addDays(weekStart, 7)">Semana ▶</button>
      </div>
      <strong>{{ title }}</strong>
      <span class="muted">Horário: 08:00–18:00</span>
    </header>

    <div class="calendar">
      <!-- Header Row: blank gutter + day headers -->
      <div class="gutter-header"></div>
      <div class="days-header">
        <div
          v-for="d in days"
          :key="d.toISOString() + '-hdr'"
          class="day-hcell"
          :class="{ today: isSameDay(d, today) }"
        >
          <div class="weekday">{{ d.toLocaleDateString('pt-BR', { weekday: 'short' }) }}</div>
          <div class="day">{{ d.getDate() }}</div>
        </div>
      </div>

      <!-- Scrollable Body: time gutter + day columns -->
      <div class="body" ref="scroller">
        <div class="time-col">
          <div v-for="h in hours" :key="h" class="time-cell">
            {{ String(h).padStart(2, '0') }}:00
          </div>
        </div>
        <div class="days">
          <div
            v-for="d in days"
            :key="d.toISOString()"
            class="day-col"
            :class="{ today: isSameDay(d, today), weekend: [0, 6].includes(d.getDay()) }"
          >
            <div
              class="slots"
              :style="{ gridTemplateRows: `repeat(${totalSlots}, var(--slot-h))` }"
            >
              <div v-for="n in totalSlots" :key="n" class="slot" @click="slotClick(d, n)"></div>

              <!-- current time indicator -->
              <div v-if="isSameDay(d, now)" class="now" :style="{ top: nowPercent + '%' }">
                <span class="dot"></span>
                <span class="line"></span>
              </div>

              <button
                v-for="a in dayAppointments(d)"
                :key="a.id"
                class="event"
                :class="{ cancelled: a.status === 'cancelled' }"
                :style="{ gridRow: `${slotFor(a.date)} / span ${spanFor(a)}` }"
                @click="edit(a)"
                :disabled="a.status === 'cancelled'"
              >
                <div class="event-header">
                  <strong>{{
                    new Date(a.date).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  }}</strong>
                  <span v-if="a.status === 'cancelled'" class="status-badge">Cancelado</span>
                </div>
                <div class="event-service">{{ a.serviceName }}</div>
                <small class="event-pet muted">{{ a.petName }}</small>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stack {
  display: grid;
  gap: 1rem;
}
.row {
  display: flex;
  gap: 0.5rem;
}
.row.between {
  justify-content: space-between;
}
.center {
  align-items: center;
}
.wrap {
  flex-wrap: wrap;
}
.gap {
  gap: 0.5rem;
}
.muted {
  color: var(--text);
  color: var(--muted);
}
.event strong {
  color: var(--text);
  font-weight: 700;
}
.event .muted {
  color: var(--muted);
}

/* Layout */
.calendar {
  --slot-h: 32px; /* each 30-min */
  --line-weak: color-mix(in srgb, var(--border) 55%, var(--surface) 45%);
  --line-strong: color-mix(in srgb, var(--border) 75%, var(--surface) 25%);
  --event-bg: color-mix(in srgb, var(--primary) 14%, var(--surface) 86%);
  --event-bg-hover: color-mix(in srgb, var(--primary) 20%, var(--surface) 80%);
  --event-border: color-mix(in srgb, var(--primary) 35%, var(--surface) 65%);
  display: grid;
  grid-template-columns: 80px 1fr;
  grid-template-rows: auto 1fr;
  gap: 8px;
  border-top: 1px solid var(--border);
}
.gutter-header {
  grid-column: 1;
  grid-row: 1;
}
.days-header {
  grid-column: 2;
  grid-row: 1;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  position: sticky;
  top: 0;
  background: var(--bg);
  z-index: 5;
  padding-top: 6px;
}
.day-hcell {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 6px 8px;
}
.day-hcell.today .day {
  background: var(--primary);
  color: white;
  border-radius: 999px;
  padding: 2px 8px;
}
.weekday {
  text-transform: capitalize;
  color: var(--muted);
  width: 48px;
}
.day {
  font-weight: 700;
}

.body {
  grid-column: 1 / span 2;
  grid-row: 2;
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 8px;
  height: calc(100vh - 280px);
  overflow: auto;
}
.time-col {
  display: grid;
  grid-auto-rows: calc(var(--slot-h) * 2);
  position: sticky;
  left: 0;
  background: var(--bg);
  z-index: 4;
}
.time-cell {
  color: var(--muted);
  font-size: 0.85rem;
  padding-top: 6px;
}

.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}
.day-col {
  position: relative;
}
.day-col.today .slots {
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary) 35%, transparent);
}
.day-col.weekend .slots {
  background: color-mix(in srgb, var(--surface) 96%, var(--text) 4%);
}

.slots {
  position: relative;
  display: grid;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}
.slot {
  border-top: 1px dashed var(--line-weak);
  height: var(--slot-h);
}
.slot:nth-child(2n) {
  border-top-style: solid;
  border-top-color: var(--line-strong);
}
.slot:first-child {
  border-top: none;
}

/* Now indicator inside today column */
.now {
  position: absolute;
  left: 0;
  right: 0;
  height: 0;
  pointer-events: none;
}
.now .dot {
  position: absolute;
  left: -5px;
  width: 10px;
  height: 10px;
  background: var(--danger);
  border-radius: 50%;
  transform: translateY(-50%);
}
.now .line {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--danger);
  transform: translateY(-50%);
}

.event {
  position: relative;
  margin: 2px 6px;
  padding: 6px 8px;
  border-radius: 6px;
  background: var(--event-bg);
  border: 1px solid var(--event-border);
  text-align: left;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.2s ease;
}
.event:hover:not(:disabled) {
  background: var(--event-bg-hover);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.event:disabled {
  cursor: not-allowed;
}

/* Cancelled event styles */
.event.cancelled {
  background: color-mix(in srgb, var(--surface) 85%, var(--muted) 15%);
  border-color: var(--muted);
  opacity: 0.7;
}
.event.cancelled::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--danger);
  transform: translateY(-50%);
  z-index: 1;
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
}
.event-service {
  font-weight: 500;
  margin-bottom: 2px;
}
.event-pet {
  color: var(--muted);
}

.status-badge {
  background: var(--danger);
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 1px 4px;
  border-radius: 3px;
  text-transform: uppercase;
}
</style>
