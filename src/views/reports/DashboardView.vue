<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppointmentsStore } from '../../stores/appointments'
import { useServicesStore } from '../../stores/services'
import { useClientsStore } from '../../stores/clients'
import { usePetsStore } from '../../stores/pets'
import { useReports } from '../../composables/useReports'

const appointmentsStore = useAppointmentsStore()
const servicesStore = useServicesStore()
const clientsStore = useClientsStore()
const petsStore = usePetsStore()

const { appointments } = storeToRefs(appointmentsStore)
const { services } = storeToRefs(servicesStore)
const { clients } = storeToRefs(clientsStore)
const { pets } = storeToRefs(petsStore)

const {
  totalAppointments,
  totalClients,
  totalPets,
  totalServices,
  appointmentsByPeriod,
  revenue,
  popularServices,
  activeClients,
  appointmentsByWeekday,
  monthlyGrowth,
} = useReports(appointments, services, clients, pets)

onMounted(async () => {
  await Promise.all([
    appointmentsStore.fetchAppointments(),
    servicesStore.fetchServices(),
    clientsStore.fetchClients(),
    petsStore.fetchPets(),
  ])
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}
</script>

<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>Dashboard & Relatórios</h1>
      <p>Visão geral do negócio e métricas importantes</p>
    </header>

    <!-- Métricas Principais -->
    <section class="metrics-grid">
      <div class="metric-card">
        <div class="metric-icon">📅</div>
        <div class="metric-content">
          <h3>{{ totalAppointments }}</h3>
          <p>Total de Agendamentos</p>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon">👥</div>
        <div class="metric-content">
          <h3>{{ totalClients }}</h3>
          <p>Clientes Cadastrados</p>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon">🐕</div>
        <div class="metric-content">
          <h3>{{ totalPets }}</h3>
          <p>Pets Registrados</p>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon">🛁</div>
        <div class="metric-content">
          <h3>{{ totalServices }}</h3>
          <p>Serviços Disponíveis</p>
        </div>
      </div>
    </section>

    <!-- Agendamentos por Período -->
    <section class="period-stats">
      <h2>Agendamentos por Período</h2>
      <div class="period-grid">
        <div class="period-card">
          <h4>Hoje</h4>
          <span class="period-value">{{ appointmentsByPeriod.today }}</span>
        </div>
        <div class="period-card">
          <h4>Ontem</h4>
          <span class="period-value">{{ appointmentsByPeriod.yesterday }}</span>
        </div>
        <div class="period-card">
          <h4>Esta Semana</h4>
          <span class="period-value">{{ appointmentsByPeriod.thisWeek }}</span>
        </div>
        <div class="period-card">
          <h4>Este Mês</h4>
          <span class="period-value">{{ appointmentsByPeriod.thisMonth }}</span>
        </div>
      </div>
    </section>

    <!-- Receita -->
    <section class="revenue-section">
      <h2>Receita</h2>
      <div class="revenue-grid">
        <div class="revenue-card">
          <h4>Este Mês</h4>
          <span class="revenue-value">{{ formatCurrency(revenue.thisMonth) }}</span>
        </div>
        <div class="revenue-card">
          <h4>Mês Passado</h4>
          <span class="revenue-value">{{ formatCurrency(revenue.lastMonth) }}</span>
        </div>
        <div class="revenue-card">
          <h4>Este Ano</h4>
          <span class="revenue-value">{{ formatCurrency(revenue.thisYear) }}</span>
        </div>
        <div class="revenue-card">
          <h4>Total</h4>
          <span class="revenue-value">{{ formatCurrency(revenue.total) }}</span>
        </div>
      </div>
    </section>

    <!-- Gráficos e Listas -->
    <div class="charts-grid">
      <!-- Serviços Mais Populares -->
      <section class="chart-card">
        <h3>Serviços Mais Populares</h3>
        <div class="chart-content">
          <div v-for="service in popularServices" :key="service.service" class="chart-item">
            <div class="item-info">
              <span class="item-name">{{ service.service }}</span>
              <span class="item-count">{{ service.count }} agendamentos</span>
            </div>
            <div class="item-bar">
              <div
                class="bar-fill"
                :style="{ width: `${(service.count / popularServices[0]?.count) * 100 || 0}%` }"
              ></div>
            </div>
            <span class="item-revenue">{{ formatCurrency(service.revenue) }}</span>
          </div>
        </div>
      </section>

      <!-- Clientes Mais Ativos -->
      <section class="chart-card">
        <h3>Clientes Mais Ativos</h3>
        <div class="chart-content">
          <div v-for="client in activeClients" :key="client.client" class="chart-item">
            <div class="item-info">
              <span class="item-name">{{ client.client }}</span>
              <span class="item-count">{{ client.count }} agendamentos</span>
            </div>
            <div class="item-bar">
              <div
                class="bar-fill"
                :style="{ width: `${(client.count / activeClients[0]?.count) * 100 || 0}%` }"
              ></div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Agendamentos por Dia da Semana -->
    <section class="weekday-chart">
      <h3>Agendamentos por Dia da Semana</h3>
      <div class="weekday-bars">
        <div v-for="day in appointmentsByWeekday" :key="day.day" class="weekday-item">
          <div class="weekday-bar">
            <div
              class="weekday-fill"
              :style="{
                height: `${(day.count / Math.max(...appointmentsByWeekday.map((d) => d.count))) * 100 || 0}%`,
              }"
            ></div>
          </div>
          <span class="weekday-label">{{ day.day }}</span>
          <span class="weekday-count">{{ day.count }}</span>
        </div>
      </div>
    </section>

    <!-- Crescimento Mensal -->
    <section class="growth-chart">
      <h3>Crescimento dos Últimos 6 Meses</h3>
      <div class="growth-table">
        <div class="growth-header">
          <span>Mês</span>
          <span>Agendamentos</span>
          <span>Receita</span>
        </div>
        <div v-for="month in monthlyGrowth" :key="month.month" class="growth-row">
          <span>{{ month.month }}</span>
          <span>{{ month.appointments }}</span>
          <span>{{ formatCurrency(month.revenue) }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.dashboard {
  display: grid;
  gap: 2rem;
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 1rem;
}

.dashboard-header h1 {
  color: var(--text);
  margin: 0 0 0.5rem;
}

.dashboard-header p {
  color: var(--muted);
  margin: 0;
}

/* Métricas Principais */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

@media (max-width: 1024px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
}

.metric-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-height: 100px;
}

.metric-icon {
  font-size: 1.5rem;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary);
  border-radius: 50%;
  flex-shrink: 0;
}

.metric-content {
  flex: 1;
  min-width: 0;
}

.metric-content h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text);
}

.metric-content p {
  margin: 0.25rem 0 0;
  color: var(--muted);
  font-size: 0.8rem;
  line-height: 1.2;
}

/* Períodos */
.period-stats,
.revenue-section {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
}

.period-stats h2,
.revenue-section h2 {
  margin: 0 0 1rem;
  color: var(--text);
}

.period-grid,
.revenue-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.period-card,
.revenue-card {
  text-align: center;
  padding: 1rem;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 8px;
}

.period-card h4,
.revenue-card h4 {
  margin: 0 0 0.5rem;
  color: var(--muted);
  font-size: 0.9rem;
  font-weight: 500;
}

.period-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
}

.revenue-value {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--success, #10b981);
}

/* Gráficos */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.chart-card,
.weekday-chart,
.growth-chart {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
}

.chart-card h3,
.weekday-chart h3,
.growth-chart h3 {
  margin: 0 0 1rem;
  color: var(--text);
}

.chart-content {
  display: grid;
  gap: 0.75rem;
}

.chart-item {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  align-items: center;
}

.item-info {
  display: grid;
  gap: 0.25rem;
}

.item-name {
  font-weight: 500;
  color: var(--text);
}

.item-count {
  font-size: 0.875rem;
  color: var(--muted);
}

.item-bar {
  width: 100px;
  height: 8px;
  background: var(--border);
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: var(--primary);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.item-revenue {
  font-weight: 600;
  color: var(--success, #10b981);
  font-size: 0.875rem;
}

/* Dias da Semana */
.weekday-bars {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}

.weekday-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.weekday-bar {
  width: 30px;
  height: 100px;
  background: var(--border);
  border-radius: 4px;
  display: flex;
  align-items: flex-end;
}

.weekday-fill {
  width: 100%;
  background: var(--primary);
  border-radius: 4px;
  transition: height 0.3s ease;
  min-height: 4px;
}

.weekday-label {
  font-weight: 500;
  color: var(--text);
  font-size: 0.875rem;
}

.weekday-count {
  font-size: 0.75rem;
  color: var(--muted);
}

/* Crescimento */
.growth-table {
  display: grid;
  gap: 0.5rem;
}

.growth-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  padding: 0.75rem;
  background: var(--background);
  border-radius: 8px;
  font-weight: 600;
  color: var(--text);
}

.growth-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
}

@media (max-width: 768px) {
  .dashboard {
    padding: 0.5rem;
    gap: 1.5rem;
  }

  .metric-card {
    padding: 1rem;
    gap: 0.5rem;
  }

  .metric-icon {
    width: 2rem;
    height: 2rem;
    font-size: 1.2rem;
  }

  .metric-content h3 {
    font-size: 1.3rem;
  }

  .metric-content p {
    font-size: 0.75rem;
  }

  .charts-grid {
    grid-template-columns: 1fr;
  }

  .weekday-bars {
    grid-template-columns: repeat(7, 1fr);
    gap: 0.5rem;
  }

  .weekday-bar {
    width: 20px;
    height: 60px;
  }

  .growth-header,
  .growth-row {
    font-size: 0.875rem;
  }
}
</style>
