import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ordersApi } from '@/utils/api'

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref([])

  async function createOrder(payload) {
    const o = await ordersApi.create(payload)
    orders.value.unshift(o)
    return o
  }

  async function fetchMy(clientId) {
    orders.value = await ordersApi.listByClient(clientId)
  }

  return { orders, createOrder, fetchMy }
})
