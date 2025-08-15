<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useAccountStore } from '@/stores/account'

const auth = useAuthStore()
const account = useAccountStore()

onMounted(() => {
  if (auth.user?.clientId) account.load(auth.user.clientId)
})

function saveAddress(e) {
  e.preventDefault()
  const form = new FormData(e.target)
  account.update({
    addressLine: form.get('addressLine'),
    number: form.get('number'),
    complement: form.get('complement'),
    neighborhood: form.get('neighborhood'),
    city: form.get('city'),
    state: form.get('state'),
    zip: form.get('zip'),
  })
}

function saveBilling(e) {
  e.preventDefault()
  const form = new FormData(e.target)
  const card = (form.get('card') || '').trim()
  account.update({
    cpf: form.get('cpf'),
    billingCardLast4: card ? card.slice(-4) : '',
  })
}
</script>

<template>
  <main class="container">
    <h1 class="page-title">Minha conta</h1>

    <div class="grid-2">
      <section class="card">
        <h2>Endereço</h2>
        <form class="grid-form" @submit="saveAddress">
          <div class="form-group">
            <label>Endereço</label><input name="addressLine" :value="account.me?.addressLine" />
          </div>
          <div class="form-group">
            <label>Número</label><input name="number" :value="account.me?.number" />
          </div>
          <div class="form-group">
            <label>Complemento</label><input name="complement" :value="account.me?.complement" />
          </div>
          <div class="form-group">
            <label>Bairro</label><input name="neighborhood" :value="account.me?.neighborhood" />
          </div>
          <div class="form-group">
            <label>Cidade</label><input name="city" :value="account.me?.city" />
          </div>
          <div class="form-group">
            <label>Estado</label><input name="state" :value="account.me?.state" />
          </div>
          <div class="form-group">
            <label>CEP</label><input name="zip" :value="account.me?.zip" />
          </div>
          <div class="form-group" style="grid-column: 1 / -1">
            <button class="btn primary">Salvar</button>
          </div>
        </form>
      </section>

      <section class="card">
        <h2>Cobrança</h2>
        <form class="grid-form" @submit="saveBilling">
          <div class="form-group">
            <label>CPF</label><input name="cpf" :value="account.me?.cpf" />
          </div>
          <div class="form-group">
            <label>Cartão</label><input name="card" placeholder="•••• •••• •••• ••••" />
          </div>
          <small class="muted" style="grid-column: 1 / -1"
            >Armazenamos apenas os 4 últimos dígitos para demonstração.</small
          >
          <div v-if="account.me?.billingCardLast4" class="muted" style="grid-column: 1 / -1">
            Cartão atual: •••• •••• •••• {{ account.me.billingCardLast4 }}
          </div>
          <div class="form-group" style="grid-column: 1 / -1">
            <button class="btn primary">Salvar</button>
          </div>
        </form>
      </section>
    </div>
  </main>
</template>

<style scoped>
.grid-2 {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}
@media (min-width: 900px) {
  .grid-2 {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
