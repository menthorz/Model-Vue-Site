# PetShop Frontend

Aplicação Vue 3 + Vite com Pinia e Vue Router para gerenciar um sistema simples de agendamentos de um petshop.

## Funcionalidades

- Início com atalhos
- CRUD básico de Agendamentos (listar, criar, editar)
- Gestão simples de Pets e Serviços
- Rotas organizadas e lazy-loading de views

## Estrutura

- `src/layouts/AppLayout.vue` — layout com cabeçalho, navegação e `<router-view>`
- `src/views` — telas (Home, Agendamentos, Pets, Serviços)
- `src/components` — componentes reutilizáveis (cartões, estado vazio)
- `src/stores` — Pinia stores para estado de agendamentos, pets e serviços
- `src/utils/api.js` — Mock API em memória; troque por chamadas HTTP ao backend Node.js

## Executar

```sh
npm install
npm run dev
```

Abra http://localhost:5173.

## Próximos Passos

- Conectar com backend Node.js/Express (endpoints REST)
- Validações de formulário e feedback de erros
- Paginação/filtragem de agendamentos
- Autenticação (se necessário)
