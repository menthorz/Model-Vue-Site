import { ref, reactive } from 'vue'

const toasts = ref([])
let toastId = 0

export const useToast = () => {
  const show = (message, type = 'info', duration = 4000) => {
    const id = ++toastId
    const toast = reactive({
      id,
      message,
      type,
      duration,
      visible: true,
    })

    toasts.value.push(toast)

    // Auto remove if duration is set
    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }

    return id
  }

  const remove = (id) => {
    const index = toasts.value.findIndex((toast) => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const clear = () => {
    toasts.value.splice(0)
  }

  const success = (message, duration) => show(message, 'success', duration)
  const error = (message, duration) => show(message, 'error', duration)
  const warning = (message, duration) => show(message, 'warning', duration)
  const info = (message, duration) => show(message, 'info', duration)

  return {
    toasts,
    show,
    remove,
    clear,
    success,
    error,
    warning,
    info,
  }
}
