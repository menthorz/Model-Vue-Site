import { defineStore } from 'pinia'
import { productsApi } from '@/utils/api'

export const useProductsStore = defineStore('products', {
  state: () => ({ products: [], loading: false, error: null }),
  actions: {
    async fetchProducts() {
      if (this.products.length) return
      this.loading = true
      this.error = null
      try {
        this.products = await productsApi.list()
      } catch (e) {
        this.error = e.message
      } finally {
        this.loading = false
      }
    },
  },
})
