import { ref, computed, watch } from 'vue'

export function usePagination(items, itemsPerPage = 10) {
  const currentPage = ref(1)
  const perPage = ref(itemsPerPage)

  const totalPages = computed(() => {
    return Math.ceil(items.value.length / perPage.value)
  })

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * perPage.value
    const end = start + perPage.value
    return items.value.slice(start, end)
  })

  const hasNextPage = computed(() => {
    return currentPage.value < totalPages.value
  })

  const hasPreviousPage = computed(() => {
    return currentPage.value > 1
  })

  const nextPage = () => {
    if (hasNextPage.value) {
      currentPage.value++
    }
  }

  const previousPage = () => {
    if (hasPreviousPage.value) {
      currentPage.value--
    }
  }

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  const resetPage = () => {
    currentPage.value = 1
  }

  // Reset to first page when items change
  watch(() => items.value.length, resetPage)

  return {
    currentPage,
    perPage,
    totalPages,
    paginatedItems,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage,
    goToPage,
    resetPage,
  }
}

export function useFilter(items, filterFn) {
  const filteredItems = computed(() => {
    if (!filterFn.value) {
      return items.value
    }
    return items.value.filter(filterFn.value)
  })

  return {
    filteredItems,
  }
}

export function useSearch(items, searchFields, searchTerm) {
  const searchResults = computed(() => {
    if (!searchTerm.value || !searchTerm.value.trim()) {
      return items.value
    }

    const term = searchTerm.value.toLowerCase().trim()

    return items.value.filter((item) => {
      return searchFields.some((field) => {
        const value = getNestedValue(item, field)
        return value && value.toString().toLowerCase().includes(term)
      })
    })
  })

  return {
    searchResults,
  }
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null
  }, obj)
}
