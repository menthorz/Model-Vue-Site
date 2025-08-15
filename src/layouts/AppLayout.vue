<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSettingsStore } from '@/stores/settings'
import ToastContainer from '@/components/ui/ToastContainer.vue'

const menuOpen = ref(false)
function toggleMenu() {
  menuOpen.value = !menuOpen.value
}
const router = useRouter()
const auth = useAuthStore()
const settings = useSettingsStore()
auth.hydrate()

const initials = computed(() => {
  const n = auth.user?.name || ''
  if (!n) return ''
  return n
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
})

function doLogout() {
  auth.logout()
  router.push({ name: 'login' })
}

// Theme toggle
const theme = ref('light')
onMounted(() => {
  const saved = localStorage.getItem('theme')
  theme.value =
    saved ||
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light')
  document.documentElement.setAttribute('data-theme', theme.value)
})
watch(theme, (t) => {
  localStorage.setItem('theme', t)
  document.documentElement.setAttribute('data-theme', t)
})
function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

// Computed values for footer info
const footerAddress = computed(() => {
  const s = settings.storeInfo
  let address = s.addressLine
  if (s.number) address += `, ${s.number}`
  if (s.complement) address += ` ${s.complement}`
  if (s.neighborhood) address += ` — ${s.neighborhood}`
  if (s.city) address += ` — ${s.city}`
  if (s.state) address += `/${s.state}`
  if (s.zip) address += ` — ${s.zip}`
  return address
})

const whatsappLink = computed(() => {
  const phone = settings.storeInfo.whatsapp.replace(/\D/g, '')
  return phone ? `https://wa.me/55${phone}` : '#'
})

const phoneLink = computed(() => {
  const phone = settings.storeInfo.phone.replace(/\D/g, '')
  return phone ? `tel:${phone}` : '#'
})
</script>

<template>
  <div class="app">
    <header class="app-header">
      <div class="container">
        <h1 class="brand">
          <img class="logo" src="/favicon.ico" alt="" />
          <span>PetShop</span>
        </h1>
        <button
          class="hamburger"
          :class="{ active: menuOpen }"
          @click="toggleMenu"
          :aria-expanded="menuOpen ? 'true' : 'false'"
          aria-controls="site-nav"
          aria-label="Abrir menu"
        >
          <span></span><span></span><span></span>
          <span class="sr-only">Menu</span>
        </button>
        <nav id="site-nav" class="nav" :class="{ open: menuOpen }" @click="menuOpen = false">
          <template v-if="auth.isAdmin">
            <RouterLink to="/">Início</RouterLink>
            <RouterLink to="/clientes">Clientes</RouterLink>
            <RouterLink to="/pets">Pets</RouterLink>
            <RouterLink to="/servicos">Serviços</RouterLink>
          </template>
          <template v-else>
            <RouterLink to="/loja">Loja</RouterLink>
            <RouterLink v-if="auth.user" to="/conta">Minha conta</RouterLink>
            <RouterLink v-if="auth.user" to="/meus-pedidos">Meus pedidos</RouterLink>
          </template>
          <span class="spacer" />
          <span v-if="auth.user" class="user-badge">
            <span class="avatar" :title="auth.user.name">
              <img v-if="auth.user.avatar" :src="auth.user.avatar" alt="" />
              <span v-else>{{ initials }}</span>
            </span>
            <span class="name">{{ auth.user.name }}</span>
            <!-- Settings gear icon for admin -->
            <RouterLink
              v-if="auth.isAdmin"
              to="/configuracoes"
              class="settings-gear"
              title="Configurações"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="3" />
                <path
                  d="M12 1v6m0 6v6m11-7h-6m-6 0H1m17.5-3.5L18 14l-3.5-3.5m0 7L18 14l3.5 3.5M6.5 6.5L10 10l3.5-3.5m0 7L10 17l-3.5-3.5"
                />
              </svg>
            </RouterLink>
          </span>
          <RouterLink v-if="!auth.isAuthenticated" to="/entrar">Entrar</RouterLink>
          <button v-else class="btn small" @click.prevent="doLogout">Sair</button>
          <!-- Theme toggle moved to the far right, next to the user area/auth controls -->
          <button
            class="btn small theme-toggle"
            @click.stop="toggleTheme"
            :aria-label="theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'"
          >
            <svg
              v-if="theme === 'light'"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="4" />
              <path
                d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
              />
            </svg>
            {{ theme === 'light' ? 'Escuro' : 'Claro' }}
          </button>
        </nav>
      </div>
      <div v-if="menuOpen" class="mobile-nav-overlay" @click="menuOpen = false" />
    </header>
    <main class="container">
      <RouterView />
    </main>
    <footer class="app-footer">
      <div class="container footer-grid">
        <div class="footer-brand">
          <strong>{{ settings.storeInfo.name }}</strong>
          <div v-if="settings.storeInfo.cnpj" class="small">
            CNPJ: {{ settings.storeInfo.cnpj }}
          </div>
          <div v-if="footerAddress" class="small">{{ footerAddress }}</div>
        </div>
        <div class="footer-col">
          <h4>Contato</h4>
          <ul>
            <li v-if="settings.storeInfo.phone">
              Tel: <a :href="phoneLink">{{ settings.storeInfo.phone }}</a>
            </li>
            <li v-if="settings.storeInfo.whatsapp">
              WhatsApp:
              <a :href="whatsappLink" target="_blank" rel="noopener">
                {{ settings.storeInfo.whatsapp }}
              </a>
            </li>
            <li v-if="settings.storeInfo.email">
              Email:
              <a :href="`mailto:${settings.storeInfo.email}`">{{ settings.storeInfo.email }}</a>
            </li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Atendimento</h4>
          <ul>
            <li>Seg a Sex: {{ settings.storeInfo.businessHours.weekdays }}</li>
            <li>Sáb: {{ settings.storeInfo.businessHours.saturday }}</li>
            <li>Dom: {{ settings.storeInfo.businessHours.sunday }}</li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Institucional</h4>
          <ul>
            <li><a href="#">Trocas e Devoluções</a></li>
            <li><a href="#">Política de Privacidade</a></li>
            <li><a href="#">Termos de Uso</a></li>
          </ul>
        </div>
      </div>
      <div class="container copy">
        © {{ new Date().getFullYear() }} {{ settings.storeInfo.name }}
      </div>
    </footer>
    <ToastContainer />
  </div>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 10;
}
.container {
  /* Increase header height to comfortably fit a logo beside the brand */
  padding-block: 1.5rem;
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
.brand .logo {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: block;
}
.user-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #cbd5e1;
  background: #111827;
  border: 1px solid #374151;
  border-radius: 999px;
  padding: 0.25rem 0.5rem 0.25rem 0.25rem;
  font-size: 0.875rem;
  position: relative;
}
.user-badge .avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #0b1220;
  border: 1px solid #263041;
  display: grid;
  place-items: center;
  color: #e5e7eb;
  font-weight: 700;
  overflow: hidden;
}
.user-badge .avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.settings-gear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text);
  text-decoration: none;
  transition: all 0.2s;
  margin-left: 0.25rem;
}
.settings-gear:hover {
  background: var(--accent);
  color: white;
  transform: rotate(45deg);
}
.settings-gear svg {
  width: 16px;
  height: 16px;
}

/* Footer */
.app-footer {
  color: var(--text);
}
.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 0.5rem 0 0.75rem;
}
.footer-brand {
  display: grid;
  gap: 0.25rem;
}
.footer-brand .small {
  color: var(--muted);
  font-size: 0.9rem;
}
.footer-col h4 {
  margin: 0 0 0.4rem;
  font-size: 1rem;
}
.footer-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.25rem;
}
.footer-col a {
  color: var(--text);
  text-decoration: none;
}
.footer-col a:hover {
  text-decoration: underline;
}
.copy {
  color: var(--muted);
  font-size: 0.9rem;
  padding: 0.25rem 0 0.25rem;
}

@media (max-width: 900px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 520px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }
}
</style>
