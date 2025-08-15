<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const password = ref('')
const router = useRouter()
const auth = useAuthStore()

onMounted(() => auth.hydrate())

async function submit() {
  try {
    await auth.login(email.value, password.value)
    if (auth.isAdmin) router.replace({ name: 'home' })
    else router.replace({ name: 'shop' })
  } catch {
    // handled in store
  }
}
</script>

<template>
  <main class="container" style="max-width: 480px">
    <h1 class="page-title">Entrar</h1>
    <form class="card grid-form" @submit.prevent="submit">
      <div class="form-group">
        <label>Email</label>
        <input v-model="email" type="email" required placeholder="seu@email.com" />
      </div>
      <div class="form-group">
        <label>Senha</label>
        <input v-model="password" type="password" required placeholder="••••••" />
        <small class="muted"
          >Admin: admin@petshop.com / admin123. Cliente: email do cliente / 123456.</small
        >
      </div>
      <div class="actions">
        <button class="btn primary" :disabled="auth.loading">Entrar</button>
        <span v-if="auth.error" class="error">{{ auth.error }}</span>
      </div>
    </form>
  </main>
</template>

<style scoped>
.actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
.error {
  color: #c0392b;
}
</style>
