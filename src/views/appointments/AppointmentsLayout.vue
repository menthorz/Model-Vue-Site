<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <section class="stack">
    <header class="row between center">
      <div class="row center wrap" style="gap: 0.5rem">
        <h2>Agendamentos</h2>
        <RouterLink class="btn" to="/agendamentos">Lista</RouterLink>
        <RouterLink class="btn" to="/agendamentos/agenda">Agenda</RouterLink>
      </div>
      <RouterLink class="btn primary" to="/agendamentos/novo">Novo Agendamento</RouterLink>
    </header>
    <RouterView />
  </section>
</template>

<style scoped>
.stack {
  display: grid;
  gap: 1rem;
}
</style>
