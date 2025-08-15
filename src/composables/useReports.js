import { computed } from 'vue'

export function useReports(appointments, services, clients, pets) {
  // Métricas básicas
  const totalAppointments = computed(() => appointments.value.length)
  const totalClients = computed(() => clients.value.length)
  const totalPets = computed(() => pets.value.length)
  const totalServices = computed(() => services.value.length)

  // Agendamentos por período
  const appointmentsByPeriod = computed(() => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const thisWeek = new Date(today)
    thisWeek.setDate(thisWeek.getDate() - 7)
    const thisMonth = new Date(today)
    thisMonth.setMonth(thisMonth.getMonth() - 1)

    return {
      today: appointments.value.filter((a) => {
        const date = new Date(a.date)
        return date >= today && date < new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }).length,
      yesterday: appointments.value.filter((a) => {
        const date = new Date(a.date)
        return date >= yesterday && date < today
      }).length,
      thisWeek: appointments.value.filter((a) => {
        const date = new Date(a.date)
        return date >= thisWeek
      }).length,
      thisMonth: appointments.value.filter((a) => {
        const date = new Date(a.date)
        return date >= thisMonth
      }).length,
    }
  })

  // Receita estimada
  const revenue = computed(() => {
    const now = new Date()
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const thisYear = new Date(now.getFullYear(), 0, 1)

    const calculateRevenue = (startDate, endDate = null) => {
      return appointments.value
        .filter((a) => {
          const date = new Date(a.date)
          if (endDate) {
            return date >= startDate && date < endDate
          }
          return date >= startDate
        })
        .reduce((total, appointment) => {
          const service = services.value.find((s) => s.id === appointment.serviceId)
          return total + (service?.price || 0)
        }, 0)
    }

    return {
      thisMonth: calculateRevenue(thisMonth),
      lastMonth: calculateRevenue(lastMonth, thisMonth),
      thisYear: calculateRevenue(thisYear),
      total: calculateRevenue(new Date(0)),
    }
  })

  // Serviços mais populares
  const popularServices = computed(() => {
    const serviceCount = {}

    appointments.value.forEach((appointment) => {
      serviceCount[appointment.serviceId] = (serviceCount[appointment.serviceId] || 0) + 1
    })

    return Object.entries(serviceCount)
      .map(([serviceId, count]) => {
        const service = services.value.find((s) => s.id === parseInt(serviceId))
        return {
          service: service?.name || 'Serviço não encontrado',
          count,
          revenue: count * (service?.price || 0),
        }
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  })

  // Clientes mais ativos
  const activeClients = computed(() => {
    const clientCount = {}

    appointments.value.forEach((appointment) => {
      const pet = pets.value.find((p) => p.id === appointment.petId)
      if (pet) {
        clientCount[pet.clientId] = (clientCount[pet.clientId] || 0) + 1
      }
    })

    return Object.entries(clientCount)
      .map(([clientId, count]) => {
        const client = clients.value.find((c) => c.id === parseInt(clientId))
        return {
          client: client?.name || 'Cliente não encontrado',
          count,
          email: client?.email || '',
        }
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  })

  // Agendamentos por dia da semana
  const appointmentsByWeekday = computed(() => {
    const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    const counts = new Array(7).fill(0)

    appointments.value.forEach((appointment) => {
      const date = new Date(appointment.date)
      counts[date.getDay()]++
    })

    return weekdays.map((day, index) => ({
      day,
      count: counts[index],
    }))
  })

  // Crescimento mensal
  const monthlyGrowth = computed(() => {
    const now = new Date()
    const months = []

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)

      const appointmentsCount = appointments.value.filter((a) => {
        const appointmentDate = new Date(a.date)
        return appointmentDate >= date && appointmentDate < nextMonth
      }).length

      const revenueAmount = appointments.value
        .filter((a) => {
          const appointmentDate = new Date(a.date)
          return appointmentDate >= date && appointmentDate < nextMonth
        })
        .reduce((total, appointment) => {
          const service = services.value.find((s) => s.id === appointment.serviceId)
          return total + (service?.price || 0)
        }, 0)

      months.push({
        month: date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
        appointments: appointmentsCount,
        revenue: revenueAmount,
      })
    }

    return months
  })

  return {
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
  }
}
