// Local storage-based API for browser persistence
// Data is saved and loaded from localStorage automatically

import {
  appointmentsStorage,
  clientsStorage,
  petsStorage,
  servicesStorage,
  productsStorage,
  ordersStorage,
  getNextId,
  initializeDefaultData,
} from './storage.js'

// Initialize default data on first load
initializeDefaultData()

// Helpers for simulating API delay
const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms))

export const appointmentsApi = {
  async list() {
    await delay()
    const appointments = appointmentsStorage.load()
    return appointments
      .slice()
      .map((a) => ({ status: 'scheduled', ...a }))
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  },
  async get(id) {
    await delay()
    const appointments = appointmentsStorage.load()
    const found = appointments.find((a) => a.id === String(id))
    if (!found) throw new Error('Agendamento não encontrado')
    return { ...found }
  },
  async create(payload) {
    await delay()
    // Validation: business hours and overlap
    validateAppointment(payload)

    const pets = petsStorage.load()
    const services = servicesStorage.load()
    const appointments = appointmentsStorage.load()

    const pet = pets.find((p) => p.id === payload.petId)
    const service = services.find((s) => s.id === payload.serviceId)
    const created = {
      id: getNextId(),
      petId: payload.petId,
      petName: pet?.name || '',
      serviceId: payload.serviceId,
      serviceName: service?.name || '',
      date: payload.date,
      status: 'scheduled',
      notes: payload.notes || '',
    }

    appointments.push(created)
    appointmentsStorage.save(appointments)
    return { ...created }
  },
  async update(id, payload) {
    await delay()
    const appointments = appointmentsStorage.load()
    const idx = appointments.findIndex((a) => a.id === String(id))
    if (idx === -1) throw new Error('Agendamento não encontrado')

    // Validation: business hours and overlap (ignore current id)
    validateAppointment(payload, String(id))

    const pets = petsStorage.load()
    const services = servicesStorage.load()

    const pet = pets.find((p) => p.id === payload.petId)
    const service = services.find((s) => s.id === payload.serviceId)

    appointments[idx] = {
      ...appointments[idx],
      ...payload,
      petName: pet?.name || '',
      serviceName: service?.name || '',
      status: payload.status || appointments[idx].status || 'scheduled',
    }

    appointmentsStorage.save(appointments)
    return { ...appointments[idx] }
  },
  async cancel(id, reason = '') {
    await delay()
    const appointments = appointmentsStorage.load()
    const idx = appointments.findIndex((a) => a.id === String(id))
    if (idx === -1) throw new Error('Agendamento não encontrado')

    appointments[idx] = {
      ...appointments[idx],
      status: 'cancelled',
      cancelReason: reason,
      cancelledAt: new Date().toISOString(),
    }

    appointmentsStorage.save(appointments)
    return { ...appointments[idx] }
  },
}

// Helpers for appointment validation
const OPEN_MIN = 8 * 60
const CLOSE_MIN = 18 * 60

function getServiceDuration(serviceId) {
  const services = servicesStorage.load()
  const s = services.find((x) => String(x.id) === String(serviceId))
  return s?.duration ?? 60 // minutes
}

function startEndMinutes(dateISO, durationMin) {
  const d = new Date(dateISO)
  const start = d.getHours() * 60 + d.getMinutes()
  const end = start + durationMin
  return [start, end]
}

function validateAppointment(payload, ignoreId) {
  // Past date/time not allowed
  if (new Date(payload.date).getTime() < Date.now()) {
    throw new Error('Não é possível agendar no passado')
  }
  const duration = getServiceDuration(payload.serviceId)
  const [start, end] = startEndMinutes(payload.date, duration)

  // Business hours: must start at/after 08:00 and finish by 18:00
  if (start < OPEN_MIN || end > CLOSE_MIN) {
    throw new Error('Horário fora do expediente (08:00–18:00)')
  }

  // Overlap: any existing appointment that intersects the interval
  const appointments = appointmentsStorage.load()
  for (const a of appointments) {
    if (ignoreId && String(a.id) === String(ignoreId)) continue
    if (a.status === 'cancelled') continue
    const adur = getServiceDuration(a.serviceId)
    const [as, ae] = startEndMinutes(a.date, adur)
    const overlap = start < ae && end > as
    if (overlap) throw new Error('Já existe um agendamento que conflita com este horário')
  }
}

export const petsApi = {
  async list() {
    await delay()
    return petsStorage.load().slice()
  },
  async create(payload) {
    await delay()
    const clients = clientsStorage.load()
    const pets = petsStorage.load()

    let ownerName = payload.ownerName
    if (payload.ownerId) {
      const c = clients.find((x) => x.id === String(payload.ownerId))
      ownerName = c?.name || ownerName
    }
    // Backward compatibility: if only owner was provided
    if (!payload.ownerId && payload.owner) {
      ownerName = payload.owner
    }
    const created = {
      id: getNextId(),
      name: payload.name,
      breed: payload.breed || '',
      notes: payload.notes || '',
      ownerId: payload.ownerId || null,
      ownerName: ownerName || '',
    }

    pets.push(created)
    petsStorage.save(pets)
    return { ...created }
  },
  async update(id, payload) {
    await delay()
    const pets = petsStorage.load()
    const clients = clientsStorage.load()
    const idx = pets.findIndex((p) => p.id === String(id))
    if (idx === -1) throw new Error('Pet não encontrado')

    let ownerName = payload.ownerName
    if (payload.ownerId) {
      const c = clients.find((x) => x.id === String(payload.ownerId))
      ownerName = c?.name || ownerName
    }

    pets[idx] = { ...pets[idx], ...payload, ownerName: ownerName ?? pets[idx].ownerName }
    petsStorage.save(pets)
    return { ...pets[idx] }
  },
  async remove(id) {
    await delay()
    const pets = petsStorage.load()
    const filtered = pets.filter((p) => p.id !== String(id))
    petsStorage.save(filtered)
  },
}

export const servicesApi = {
  async list() {
    await delay()
    return servicesStorage.load().slice()
  },
  async create(payload) {
    await delay()
    const services = servicesStorage.load()
    const created = { id: getNextId(), ...payload }
    services.push(created)
    servicesStorage.save(services)
    return { ...created }
  },
  async remove(id) {
    await delay()
    const services = servicesStorage.load()
    const filtered = services.filter((s) => s.id !== String(id))
    servicesStorage.save(filtered)
  },
}

export const productsApi = {
  async list() {
    await delay()
    return productsStorage.load().slice()
  },
  async create(payload) {
    await delay()
    const products = productsStorage.load()
    const created = { id: getNextId(), ...payload }
    products.push(created)
    productsStorage.save(products)
    return { ...created }
  },
  async remove(id) {
    await delay()
    const products = productsStorage.load()
    const filtered = products.filter((p) => p.id !== String(id))
    productsStorage.save(filtered)
  },
}

export const clientsApi = {
  async list() {
    await delay()
    return clientsStorage.load().slice()
  },
  async create(payload) {
    await delay()
    const clients = clientsStorage.load()
    const created = { id: getNextId(), ...payload }
    clients.push(created)
    clientsStorage.save(clients)
    return { ...created }
  },
  async update(id, payload) {
    await delay()
    const clients = clientsStorage.load()
    const idx = clients.findIndex((c) => c.id === String(id))
    if (idx === -1) throw new Error('Cliente não encontrado')

    clients[idx] = { ...clients[idx], ...payload }
    clientsStorage.save(clients)
    return { ...clients[idx] }
  },
  async remove(id) {
    await delay()
    const clients = clientsStorage.load()
    const filtered = clients.filter((c) => c.id !== String(id))
    clientsStorage.save(filtered)
  },
}

export const ordersApi = {
  async list() {
    await delay()
    return ordersStorage
      .load()
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  },
  async create(payload) {
    await delay()
    const orders = ordersStorage.load()
    const created = {
      id: getNextId(),
      date: new Date().toISOString(),
      status: 'pending',
      ...payload,
    }
    orders.push(created)
    ordersStorage.save(orders)
    return { ...created }
  },
}

// Authentication (simple mock)
export const authApi = {
  async login(email, password) {
    await delay()
    // Simple mock authentication
    if (email === 'admin@petshop.com' && password === 'admin') {
      const user = { type: 'admin', role: 'admin', name: 'Administrador', email }
      return { token: 'admin-token-123', user }
    }
    if (email === 'client@test.com' && password === 'client') {
      const user = { type: 'customer', role: 'customer', name: 'Cliente Teste', email }
      return { token: 'client-token-456', user }
    }
    throw new Error('Credenciais inválidas')
  },
  async logout() {
    await delay()
    return true
  },
}
