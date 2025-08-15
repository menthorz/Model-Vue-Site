import { ref, computed } from 'vue'

export function useFormValidation() {
  const errors = ref({})

  const rules = {
    required: (value) => {
      if (!value || (typeof value === 'string' && !value.trim())) {
        return 'Este campo é obrigatório'
      }
      return null
    },

    email: (value) => {
      if (!value) return null
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return 'Digite um email válido'
      }
      return null
    },

    phone: (value) => {
      if (!value) return null
      const phoneRegex = /^[\d\s\-()++]+$/
      if (!phoneRegex.test(value) || value.length < 10) {
        return 'Digite um telefone válido'
      }
      return null
    },

    minLength: (min) => (value) => {
      if (!value) return null
      if (value.length < min) {
        return `Mínimo de ${min} caracteres`
      }
      return null
    },

    maxLength: (max) => (value) => {
      if (!value) return null
      if (value.length > max) {
        return `Máximo de ${max} caracteres`
      }
      return null
    },

    min: (minValue) => (value) => {
      if (value === null || value === undefined || value === '') return null
      if (Number(value) < minValue) {
        return `Valor mínimo: ${minValue}`
      }
      return null
    },

    max: (maxValue) => (value) => {
      if (value === null || value === undefined || value === '') return null
      if (Number(value) > maxValue) {
        return `Valor máximo: ${maxValue}`
      }
      return null
    },

    futureDate: (value) => {
      if (!value) return null
      const selected = new Date(value)
      if (selected.getTime() < Date.now()) {
        return 'Data deve ser no futuro'
      }
      return null
    },

    businessHours: (value) => {
      if (!value) return null
      const date = new Date(value)
      const hours = date.getHours()
      const minutes = date.getMinutes()
      const totalMinutes = hours * 60 + minutes

      if (totalMinutes < 8 * 60 || totalMinutes >= 18 * 60) {
        return 'Horário deve ser entre 08:00 e 18:00'
      }
      return null
    },
  }

  const validateField = (fieldName, value, fieldRules = []) => {
    errors.value[fieldName] = null

    for (const rule of fieldRules) {
      const error = rule(value)
      if (error) {
        errors.value[fieldName] = error
        break
      }
    }

    return !errors.value[fieldName]
  }

  const validateForm = (form, validationSchema) => {
    let isValid = true
    errors.value = {}

    for (const [fieldName, fieldRules] of Object.entries(validationSchema)) {
      const value = form[fieldName]
      const fieldValid = validateField(fieldName, value, fieldRules)
      if (!fieldValid) {
        isValid = false
      }
    }

    return isValid
  }

  const clearErrors = () => {
    errors.value = {}
  }

  const hasError = (fieldName) => {
    return !!errors.value[fieldName]
  }

  const getError = (fieldName) => {
    return errors.value[fieldName]
  }

  const isValid = computed(() => {
    return Object.values(errors.value).every((error) => !error)
  })

  return {
    errors,
    rules,
    validateField,
    validateForm,
    clearErrors,
    hasError,
    getError,
    isValid,
  }
}
