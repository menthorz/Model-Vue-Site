<script setup>
import { onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAppointmentsStore } from '@/stores/appointments'
import { useClientsStore } from '@/stores/clients'
import { usePetsStore } from '@/stores/pets'
import { useServicesStore } from '@/stores/services'

const appts = useAppointmentsStore()
const clients = useClientsStore()
const pets = usePetsStore()
const services = useServicesStore()

onMounted(() => {
  // fetch lightweight counts; if arrays already loaded, stores will no-op
  appts.fetchAppointments()
  clients.fetchClients()
  pets.fetchPets()
  services.fetchServices()
})

const counts = {
  appts: computed(() => appts.appointments?.length || 0),
  clients: computed(() => clients.clients?.length || 0),
  pets: computed(() => pets.pets?.length || 0),
  services: computed(() => services.services?.length || 0),
}
</script>

<template>
  <section class="home-container">
    <header class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">🐾 Bem-vindo ao PetShop</h1>
        <p class="hero-subtitle">
          Gerencie seus agendamentos, clientes e serviços com facilidade e eficiência
        </p>
      </div>
      <div class="hero-stats">
        <div class="stat-item">
          <span class="stat-number">{{ counts.appts }}</span>
          <span class="stat-label">Agendamentos</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-number">{{ counts.clients }}</span>
          <span class="stat-label">Clientes</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-number">{{ counts.pets }}</span>
          <span class="stat-label">Pets</span>
        </div>
      </div>
    </header>

    <main class="main-content">
      <h2 class="section-title">Acesso Rápido</h2>
      <div class="cards-grid">
        <RouterLink class="feature-card appointments" to="/agendamentos">
          <div class="card-icon">📅</div>
          <div class="card-content">
            <h3 class="card-title">
              Agendamentos
              <span class="card-badge">{{ counts.appts }}</span>
            </h3>
            <p class="card-description">
              Visualize, crie e gerencie todos os agendamentos em um calendário intuitivo
            </p>
            <div class="card-footer">
              <span class="card-action">Ver agenda →</span>
            </div>
          </div>
        </RouterLink>

        <RouterLink class="feature-card clients" to="/clientes">
          <div class="card-icon">👥</div>
          <div class="card-content">
            <h3 class="card-title">
              Clientes
              <span class="card-badge">{{ counts.clients }}</span>
            </h3>
            <p class="card-description">
              Cadastre novos clientes e mantenha suas informações sempre atualizadas
            </p>
            <div class="card-footer">
              <span class="card-action">Gerenciar →</span>
            </div>
          </div>
        </RouterLink>

        <RouterLink class="feature-card pets" to="/pets">
          <div class="card-icon">🐕</div>
          <div class="card-content">
            <h3 class="card-title">
              Pets
              <span class="card-badge">{{ counts.pets }}</span>
            </h3>
            <p class="card-description">
              Registre os pets dos clientes com informações detalhadas sobre cada animal
            </p>
            <div class="card-footer">
              <span class="card-action">Ver pets →</span>
            </div>
          </div>
        </RouterLink>

        <RouterLink class="feature-card services" to="/servicos">
          <div class="card-icon">✂️</div>
          <div class="card-content">
            <h3 class="card-title">
              Serviços
              <span class="card-badge">{{ counts.services }}</span>
            </h3>
            <p class="card-description">
              Configure banhos, tosas e pacotes especiais com preços e durações
            </p>
            <div class="card-footer">
              <span class="card-action">Configurar →</span>
            </div>
          </div>
        </RouterLink>
      </div>
    </main>

    <section class="quick-actions">
      <h3 class="section-title">Ações Rápidas</h3>
      <div class="actions-grid">
        <RouterLink to="/agendamentos/novo" class="action-btn primary">
          <i class="icon">➕</i>
          Novo Agendamento
        </RouterLink>
        <RouterLink to="/clientes/novo" class="action-btn secondary">
          <i class="icon">👤</i>
          Novo Cliente
        </RouterLink>
        <RouterLink to="/pets/novo" class="action-btn secondary">
          <i class="icon">🐾</i>
          Novo Pet
        </RouterLink>
      </div>
    </section>
  </section>
</template>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.hero-section {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: linear-gradient(
    135deg,
    var(--primary) 0%,
    color-mix(in srgb, var(--primary) 80%, #1e40af 20%) 100%
  );
  border-radius: 20px;
  color: white;
  position: relative;
  overflow: hidden;
  /* Garante contraste adequado em ambos os temas */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="40" r="1.5" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="80" r="1" fill="rgba(255,255,255,0.1)"/></svg>');
  animation: float 20s infinite linear;
}

@keyframes float {
  from {
    transform: translateY(0px);
  }
  to {
    transform: translateY(-100px);
  }
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  color: white;
}

.hero-subtitle {
  font-size: 1.125rem;
  margin: 0 0 2rem 0;
  opacity: 0.95;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  color: white;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

.hero-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  position: relative;
  z-index: 1;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
  color: white;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

.stat-label {
  display: block;
  font-size: 0.875rem;
  opacity: 0.9;
  margin-top: 0.25rem;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.stat-divider {
  width: 1px;
  height: 2rem;
  background: rgba(255, 255, 255, 0.3);
}

.main-content {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  color: var(--text);
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.feature-card {
  display: block;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 1.5rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--primary);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: var(--primary);
}

.feature-card:hover::before {
  transform: scaleX(1);
}

.feature-card.appointments {
  --accent: #3b82f6;
}

.feature-card.clients {
  --accent: #10b981;
}

.feature-card.pets {
  --accent: #f59e0b;
}

.feature-card.services {
  --accent: #8b5cf6;
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  display: block;
}

.card-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
  color: var(--text);
}

.card-badge {
  background: var(--primary);
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  min-width: 2rem;
  text-align: center;
}

.card-description {
  flex: 1;
  margin: 0 0 1rem 0;
  color: var(--muted);
  line-height: 1.5;
}

.card-footer {
  margin-top: auto;
}

.card-action {
  color: var(--primary);
  font-weight: 500;
  font-size: 0.875rem;
}

.quick-actions {
  padding: 2rem;
  background: var(--bg);
  border-radius: 16px;
  border: 1px solid var(--border);
}

.actions-grid {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.action-btn.primary {
  background: var(--primary);
  color: white;
}

.action-btn.primary:hover {
  background: color-mix(in srgb, var(--primary) 85%, black 15%);
  transform: translateY(-1px);
}

.action-btn.secondary {
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
}

.action-btn.secondary:hover {
  background: var(--bg);
  border-color: var(--primary);
  transform: translateY(-1px);
}

.action-btn .icon {
  font-size: 1rem;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-stats {
    gap: 1rem;
  }

  .cards-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    flex-direction: column;
  }

  .action-btn {
    justify-content: center;
  }
}
</style>
