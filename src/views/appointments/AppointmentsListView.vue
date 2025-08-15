<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppointmentsStore } from '../../stores/appointments'
import { usePetsStore } from '../../stores/pets'
import { useServicesStore } from '../../stores/services'
import { usePagination, useSearch, useFilter } from '../../composables/usePagination'
import AppointmentCard from '../../components/appointments/AppointmentCard.vue'
import EmptyState from '../../components/EmptyState.vue'

const appointmentsStore = useAppointmentsStore()
const petsStore = usePetsStore()
const servicesStore = useServicesStore()

const { appointments, loading } = storeToRefs(appointmentsStore)

// Search and filters
const searchTerm = ref('')
const statusFilter = ref('all')
const dateFilter = ref('all')
const petFilter = ref('')
const serviceFilter = ref('')

// Search functionality
const { searchResults } = useSearch(appointments, ['pet.name', 'service.name', 'notes'], searchTerm)

// Filter functionality
const filterFn = computed(() => {
  return (appointment) => {
    // Status filter
    if (statusFilter.value !== 'all') {
      const now = new Date()
      const appointmentDate = new Date(appointment.date)

      if (statusFilter.value === 'upcoming' && appointmentDate <= now) return false
      if (statusFilter.value === 'past' && appointmentDate > now) return false
    }

    // Date filter
    if (dateFilter.value !== 'all') {
      const now = new Date()
      const appointmentDate = new Date(appointment.date)
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      const weekFromNow = new Date(today)
      weekFromNow.setDate(weekFromNow.getDate() + 7)

      if (dateFilter.value === 'today' && (appointmentDate < today || appointmentDate >= tomorrow))
        return false
      if (
        dateFilter.value === 'week' &&
        (appointmentDate < today || appointmentDate >= weekFromNow)
      )
        return false
      if (dateFilter.value === 'month') {
        const monthFromNow = new Date(today)
        monthFromNow.setMonth(monthFromNow.getMonth() + 1)
        if (appointmentDate < today || appointmentDate >= monthFromNow) return false
      }
    }

    // Pet filter
    if (petFilter.value && appointment.petId !== petFilter.value) return false

    // Service filter
    if (serviceFilter.value && appointment.serviceId !== serviceFilter.value) return false

    return true
  }
})

const { filteredItems } = useFilter(searchResults, filterFn)

// Pagination
const {
  currentPage,
  totalPages,
  paginatedItems,
  hasNextPage,
  hasPreviousPage,
  nextPage,
  previousPage,
  goToPage,
} = usePagination(filteredItems, 8)

// Computed values for display
const totalAppointments = computed(() => appointments.value.length)
const filteredCount = computed(() => filteredItems.value.length)

const getVisiblePages = computed(() => {
  const pages = []
  const current = currentPage.value
  const total = totalPages.value

  if (total <= 7) {
    // Show all pages if total is 7 or less
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Show first page, current page range, and last page
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      if (total > 6) pages.push('...', total)
    } else if (current >= total - 3) {
      pages.push(1)
      if (total > 6) pages.push('...')
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1, '...', current - 1, current, current + 1, '...', total)
    }
  }

  return pages.filter((page) => page !== '...' || pages.indexOf(page) === pages.lastIndexOf(page))
})

const clearFilters = () => {
  searchTerm.value = ''
  statusFilter.value = 'all'
  dateFilter.value = 'all'
  petFilter.value = ''
  serviceFilter.value = ''
}

onMounted(async () => {
  await Promise.all([
    appointmentsStore.fetchAppointments(),
    petsStore.fetchPets(),
    servicesStore.fetchServices(),
  ])
})
</script>

<template>
  <div class="stack">
    <!-- Filters and Search -->
    <div class="filters-section">
      <div class="search-bar">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Buscar agendamentos..."
          class="search-input"
        />
      </div>

      <div class="filters-grid">
        <select v-model="statusFilter" class="filter-select">
          <option value="all">Todos os status</option>
          <option value="upcoming">Próximos</option>
          <option value="past">Passados</option>
        </select>

        <select v-model="dateFilter" class="filter-select">
          <option value="all">Todas as datas</option>
          <option value="today">Hoje</option>
          <option value="week">Esta semana</option>
          <option value="month">Este mês</option>
        </select>

        <select v-model="petFilter" class="filter-select">
          <option value="">Todos os pets</option>
          <option v-for="pet in petsStore.pets" :key="pet.id" :value="pet.id">
            {{ pet.name }}
          </option>
        </select>

        <select v-model="serviceFilter" class="filter-select">
          <option value="">Todos os serviços</option>
          <option v-for="service in servicesStore.services" :key="service.id" :value="service.id">
            {{ service.name }}
          </option>
        </select>

        <button @click="clearFilters" class="btn ghost clear-btn">Limpar filtros</button>
      </div>
    </div>

    <!-- Results Info -->
    <div class="results-info">
      <span>
        Mostrando {{ paginatedItems.length }} de {{ filteredCount }} agendamentos
        <template v-if="filteredCount !== totalAppointments">
          ({{ totalAppointments }} no total)
        </template>
      </span>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading">Carregando...</div>

    <!-- Empty States -->
    <EmptyState
      v-else-if="!totalAppointments"
      title="Nenhum agendamento"
      description="Crie o primeiro clicando em 'Novo Agendamento'"
    />

    <EmptyState
      v-else-if="!filteredCount"
      title="Nenhum resultado encontrado"
      description="Tente ajustar os filtros de busca"
    />

    <!-- Appointments List -->
    <div v-else class="list">
      <AppointmentCard v-for="a in paginatedItems" :key="a.id" :appointment="a" />
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="pagination">
      <button @click="previousPage" :disabled="!hasPreviousPage" class="btn pagination-btn">
        Anterior
      </button>

      <div class="page-numbers">
        <button
          v-for="page in getVisiblePages"
          :key="page"
          @click="goToPage(page)"
          :class="['btn', 'page-btn', { active: page === currentPage }]"
        >
          {{ page }}
        </button>
      </div>

      <button @click="nextPage" :disabled="!hasNextPage" class="btn pagination-btn">Próxima</button>
    </div>
  </div>
</template>

<style scoped>
.stack {
  display: grid;
  gap: 1.5rem;
}

.filters-section {
  display: grid;
  gap: 1rem;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.search-input {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 0.95rem;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.75rem;
  align-items: end;
}

.filter-select {
  padding: 0.5rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--surface);
  color: var(--text);
}

.clear-btn {
  white-space: nowrap;
}

.results-info {
  padding: 0.5rem 0.75rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 0.875rem;
  color: var(--muted);
}

.loading {
  text-align: center;
  padding: 2rem;
  color: var(--muted);
}

.list {
  display: grid;
  gap: 0.75rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.page-numbers {
  display: flex;
  gap: 0.25rem;
}

.btn {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--surface);
  color: var(--text);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.btn:hover:not(:disabled) {
  background: var(--surface-hover);
  transform: translateY(-1px);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.btn.ghost {
  background: transparent;
  border-color: var(--border);
}

.page-btn {
  min-width: 2.5rem;
  text-align: center;
}

.page-btn.active {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
}

.pagination-btn {
  padding: 0.5rem 1rem;
}

@media (max-width: 640px) {
  .filters-grid {
    grid-template-columns: 1fr;
  }

  .pagination {
    flex-wrap: wrap;
  }

  .page-numbers {
    order: -1;
    width: 100%;
    justify-content: center;
    margin-bottom: 0.5rem;
  }
}
</style>
