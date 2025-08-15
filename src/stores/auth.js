import { defineStore } from 'pinia'
import { authApi } from '@/utils/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    loading: false,
    error: null,
  }),
  getters: {
    isAuthenticated: (s) => !!s.token,
    isAdmin: (s) => s.user?.role === 'admin',
  },
  actions: {
    async login(email, password) {
      this.loading = true
      this.error = null
      try {
        const { token, user } = await authApi.login(email, password)
        this.user = user
        this.token = token
        localStorage.setItem('auth', JSON.stringify({ token, user }))
      } catch (e) {
        this.error = e.message || 'Erro ao autenticar'
        throw e
      } finally {
        this.loading = false
      }
    },
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('auth')
    },
    hydrate() {
      const raw = localStorage.getItem('auth')
      if (raw) {
        const { token, user } = JSON.parse(raw)
        this.user = user
        this.token = token
      }
    },
  },
})
