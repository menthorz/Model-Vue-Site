import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({ items: [] }),
  getters: {
    total: (s) => s.items.reduce((sum, it) => sum + it.price * it.qty, 0),
    count: (s) => s.items.reduce((n, it) => n + it.qty, 0),
  },
  actions: {
    add(item) {
      const found = this.items.find((i) => i.id === item.id)
      if (found) found.qty += 1
      else this.items.push({ ...item, qty: 1 })
    },
    remove(id) {
      this.items = this.items.filter((i) => i.id !== id)
    },
    clear() {
      this.items = []
    },
  },
})
