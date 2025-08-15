import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { title: 'Início', admin: true },
    },
    {
      path: '/entrar',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
      meta: { title: 'Entrar', public: true },
    },
    {
      path: '/loja',
      name: 'shop',
      component: () => import('../views/shop/ShopView.vue'),
      meta: { title: 'Loja' },
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('../views/shop/CheckoutView.vue'),
      meta: { title: 'Checkout' },
    },
    {
      path: '/checkout/sucesso',
      name: 'checkout-success',
      component: () => import('../views/shop/CheckoutSuccessView.vue'),
      meta: { title: 'Pedido confirmado' },
    },
    {
      path: '/meus-pedidos',
      name: 'my-orders',
      component: () => import('../views/shop/MyOrdersView.vue'),
      meta: { title: 'Meus pedidos' },
    },
    {
      path: '/conta',
      name: 'account',
      component: () => import('../views/shop/AccountView.vue'),
      meta: { title: 'Minha conta' },
    },
    {
      path: '/agendamentos',
      component: () => import('../views/appointments/AppointmentsLayout.vue'),
      meta: { admin: true },
      children: [
        {
          path: '',
          name: 'appointments-list',
          component: () => import('../views/appointments/AppointmentsListView.vue'),
          meta: { title: 'Agendamentos', admin: true },
        },
        {
          path: 'agenda',
          name: 'appointments-calendar',
          component: () => import('../views/appointments/AppointmentsCalendarView.vue'),
          meta: { title: 'Agenda', admin: true },
        },
        {
          path: 'novo',
          name: 'appointment-new',
          component: () => import('../views/appointments/AppointmentFormView.vue'),
          meta: { title: 'Novo Agendamento', admin: true },
        },
        {
          path: ':id/editar',
          name: 'appointment-edit',
          component: () => import('../views/appointments/AppointmentFormView.vue'),
          meta: { title: 'Editar Agendamento', admin: true },
          props: true,
        },
      ],
    },
    {
      path: '/pets',
      name: 'pets',
      component: () => import('../views/pets/PetsView.vue'),
      meta: { title: 'Pets', admin: true },
    },
    {
      path: '/pets/novo',
      name: 'pets-new',
      component: () => import('../views/pets/PetsView.vue'),
      meta: { title: 'Novo Pet', admin: true },
    },
    {
      path: '/clientes',
      name: 'clients',
      component: () => import('../views/clients/ClientsView.vue'),
      meta: { title: 'Clientes', admin: true },
    },
    {
      path: '/clientes/novo',
      name: 'clients-new',
      component: () => import('../views/clients/ClientsView.vue'),
      meta: { title: 'Novo Cliente', admin: true },
    },
    {
      path: '/servicos',
      name: 'services',
      component: () => import('../views/services/ServicesView.vue'),
      meta: { title: 'Serviços', admin: true },
    },
    {
      path: '/configuracoes',
      name: 'settings',
      component: () => import('../views/settings/SettingsView.vue'),
      meta: { title: 'Configurações', admin: true },
    },
    {
      path: '/relatorios',
      name: 'reports',
      component: () => import('../views/reports/DashboardView.vue'),
      meta: { title: 'Relatórios', admin: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFound.vue'),
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  auth.hydrate()
  const requiresAdmin = to.matched.some((r) => r.meta?.admin)
  if (requiresAdmin && !auth.isAdmin) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.name === 'login' && auth.isAuthenticated) {
    return { name: auth.isAdmin ? 'home' : 'shop' }
  }
  // Customer-required pages
  const requiresCustomer = ['checkout', 'checkout-success', 'my-orders', 'account'].includes(
    to.name,
  )
  if (requiresCustomer && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
})

router.afterEach((to) => {
  if (to.meta?.title) document.title = `${to.meta.title} · PetShop`
})

export default router
