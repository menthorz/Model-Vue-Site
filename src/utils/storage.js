// Local storage utilities for persisting data in the browser

const STORAGE_KEYS = {
  APPOINTMENTS: 'petshop_appointments',
  CLIENTS: 'petshop_clients',
  PETS: 'petshop_pets',
  SERVICES: 'petshop_services',
  PRODUCTS: 'petshop_products',
  ORDERS: 'petshop_orders',
  LAST_ID: 'petshop_last_id',
}

// Generic storage functions
export function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.warn('Failed to save to localStorage:', error)
  }
}

export function loadFromStorage(key, fallback = []) {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch (error) {
    console.warn('Failed to load from localStorage:', error)
    return fallback
  }
}

export function clearStorage(key) {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.warn('Failed to clear localStorage:', error)
  }
}

// ID management for new records
export function getNextId() {
  const lastId = loadFromStorage(STORAGE_KEYS.LAST_ID, 100)
  const nextId = lastId + 1
  saveToStorage(STORAGE_KEYS.LAST_ID, nextId)
  return String(nextId)
}

// Specific storage functions for each data type
export const appointmentsStorage = {
  save: (data) => saveToStorage(STORAGE_KEYS.APPOINTMENTS, data),
  load: () => loadFromStorage(STORAGE_KEYS.APPOINTMENTS, []),
  clear: () => clearStorage(STORAGE_KEYS.APPOINTMENTS),
}

export const clientsStorage = {
  save: (data) => saveToStorage(STORAGE_KEYS.CLIENTS, data),
  load: () => loadFromStorage(STORAGE_KEYS.CLIENTS, []),
  clear: () => clearStorage(STORAGE_KEYS.CLIENTS),
}

export const petsStorage = {
  save: (data) => saveToStorage(STORAGE_KEYS.PETS, data),
  load: () => loadFromStorage(STORAGE_KEYS.PETS, []),
  clear: () => clearStorage(STORAGE_KEYS.PETS),
}

export const servicesStorage = {
  save: (data) => saveToStorage(STORAGE_KEYS.SERVICES, data),
  load: () => loadFromStorage(STORAGE_KEYS.SERVICES, []),
  clear: () => clearStorage(STORAGE_KEYS.SERVICES),
}

export const productsStorage = {
  save: (data) => saveToStorage(STORAGE_KEYS.PRODUCTS, data),
  load: () => loadFromStorage(STORAGE_KEYS.PRODUCTS, []),
  clear: () => clearStorage(STORAGE_KEYS.PRODUCTS),
}

export const ordersStorage = {
  save: (data) => saveToStorage(STORAGE_KEYS.ORDERS, data),
  load: () => loadFromStorage(STORAGE_KEYS.ORDERS, []),
  clear: () => clearStorage(STORAGE_KEYS.ORDERS),
}

// Initialize data with default values if storage is empty
export function initializeDefaultData() {
  // Default clients
  if (clientsStorage.load().length === 0) {
    clientsStorage.save([
      {
        id: '10',
        name: 'Ana Silva',
        phone: '(11) 99999-0000',
        email: 'ana@example.com',
        cpf: '123.456.789-00',
        billingCardLast4: '4242',
        addressLine: 'Rua das Flores',
        number: '123',
        complement: '',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zip: '01000-000',
      },
      {
        id: '11',
        name: 'João Santos',
        phone: '(11) 98888-0000',
        email: 'joao@example.com',
        cpf: '987.654.321-00',
        billingCardLast4: '',
        addressLine: 'Av. Paulista',
        number: '500',
        complement: 'Ap 12',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        zip: '02000-000',
      },
    ])
  }

  // Default pets
  if (petsStorage.load().length === 0) {
    petsStorage.save([
      {
        id: '1',
        name: 'Rex',
        ownerId: '10',
        ownerName: 'Ana Silva',
        breed: 'Golden Retriever',
        notes: 'Muito carinhoso',
      },
      {
        id: '2',
        name: 'Mia',
        ownerId: '11',
        ownerName: 'João Santos',
        breed: 'Poodle',
        notes: 'Precisa de tosa frequente',
      },
    ])
  }

  // Default services
  if (servicesStorage.load().length === 0) {
    servicesStorage.save([
      { id: '1', name: 'Banho', duration: 60, price: 60 },
      { id: '2', name: 'Tosa', duration: 90, price: 90 },
      { id: '3', name: 'Banho + Tosa', duration: 120, price: 140 },
      { id: '4', name: 'Corte de Unhas', duration: 30, price: 25 },
    ])
  }

  // Default products
  if (productsStorage.load().length === 0) {
    productsStorage.save([
      { id: 'p1', name: 'Shampoo Neutro', price: 29.9 },
      { id: 'p2', name: 'Coleira Premium', price: 49.9 },
      { id: 'p3', name: 'Brinquedo Mordedor', price: 19.9 },
      { id: 'p4', name: 'Ração Premium 15kg', price: 89.9 },
    ])
  }

  // Default appointments (only if empty)
  if (appointmentsStorage.load().length === 0) {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(10, 0, 0, 0)

    appointmentsStorage.save([
      {
        id: '1',
        petId: '1',
        petName: 'Rex',
        serviceId: '1',
        serviceName: 'Banho',
        date: tomorrow.toISOString(),
        status: 'scheduled',
        notes: 'Cliente preferencial',
      },
    ])
  }
}
