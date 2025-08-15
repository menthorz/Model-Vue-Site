<script setup>
import { ref, onMounted } from 'vue'

const showInstallPrompt = ref(false)
const deferredPrompt = ref(null)

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt.value = e
    showInstallPrompt.value = true
  })

  window.addEventListener('appinstalled', () => {
    showInstallPrompt.value = false
    deferredPrompt.value = null
  })
})

async function installApp() {
  if (!deferredPrompt.value) return

  deferredPrompt.value.prompt()
  const result = await deferredPrompt.value.userChoice

  if (result.outcome === 'accepted') {
    showInstallPrompt.value = false
  }

  deferredPrompt.value = null
}

function dismissPrompt() {
  showInstallPrompt.value = false
}
</script>

<template>
  <div v-if="showInstallPrompt" class="install-prompt">
    <div class="prompt-content">
      <div class="prompt-icon">📱</div>
      <div class="prompt-text">
        <h4>Instalar PetShop</h4>
        <p>Adicione o app à sua tela inicial para acesso rápido</p>
      </div>
      <div class="prompt-actions">
        <button @click="dismissPrompt" class="btn ghost">Depois</button>
        <button @click="installApp" class="btn primary">Instalar</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.install-prompt {
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
  z-index: 1000;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.prompt-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
}

.prompt-icon {
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background: var(--primary);
  border-radius: 50%;
}

.prompt-text {
  flex: 1;
}

.prompt-text h4 {
  margin: 0 0 0.25rem;
  color: var(--text);
  font-size: 1rem;
}

.prompt-text p {
  margin: 0;
  color: var(--muted);
  font-size: 0.875rem;
}

.prompt-actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.btn.primary {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
}

.btn.ghost {
  background: transparent;
}

.btn:hover {
  transform: translateY(-1px);
}

@media (max-width: 640px) {
  .install-prompt {
    left: 0.5rem;
    right: 0.5rem;
  }

  .prompt-content {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }

  .prompt-actions {
    width: 100%;
    justify-content: center;
  }
}
</style>
