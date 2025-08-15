# PetShop Frontend

Aplicação Vue 3 + Vite moderna para gerenciamento completo de petshop com interface intuitiva e funcionalidades avançadas.

## 🚀 Funcionalidades Implementadas

### ✅ Interface e Navegação

- Interface moderna e responsiva com tema claro/escuro
- Layout profissional com navegação intuitiva
- Ícones SVG responsivos ao tema
- Sistema de notificações toast
- Design consistente em toda aplicação

### ✅ Autenticação e Perfis

- Sistema de login com dois perfis:
  - **Admin**: admin@petshop.com / admin
  - **Cliente**: client@test.com / client
- Navegação contextual por perfil
- Botão de configurações (engrenagem) para admins

### ✅ Gerenciamento Completo

- **Clientes**: CRUD completo com validação
- **Pets**: CRUD completo com edição inline
- **Serviços**: CRUD completo com preços e duração
- **Agendamentos**: Sistema completo com validação de conflitos

### ✅ Funcionalidades Avançadas

- **Validação robusta**: Formulários com validação em tempo real
- **Paginação inteligente**: Navegação eficiente por grandes volumes
- **Sistema de busca**: Pesquisa em múltiplos campos
- **Filtros avançados**: Por status, data, pet, serviço
- **Persistência**: Dados salvos no localStorage automaticamente

### ✅ Configurações Dinâmicas

- **Painel de configurações**: Gerenciamento completo da loja
- **Footer dinâmico**: Atualizado automaticamente
- **Informações da empresa**: Nome, CNPJ, contatos, endereço
- **Horários e redes sociais**: Configuráveis pelo admin

### ✅ Deploy e Acesso

- **GitHub Actions**: Deploy automático configurado
- **GitHub Pages**: Site publicado automaticamente
- **Link de acesso**: https://menthorz.github.io/Model-Vue-Site/

## 🛠️ Tecnologias

- **Vue 3** + Composition API
- **Vite** para build otimizado
- **Pinia** para gerenciamento de estado
- **Vue Router** para navegação
- **CSS Tokens** para sistema de tema
- **LocalStorage API** para persistência

## 🏃‍♂️ Executar Localmente

```sh
npm install
npm run dev
```

Acesse: http://localhost:5173

## 🎯 Próximos Passos

As seguintes funcionalidades ainda podem ser implementadas:

- **Backend Integration**: Conectar com API REST Node.js/Express
- **Relatórios**: Dashboard com métricas e gráficos de agendamentos
- **Notificações**: Sistema de lembretes por email/SMS
- **Calendário avançado**: Visualização mensal com drag-and-drop
- **Multi-tenancy**: Suporte para múltiplas lojas
- **PWA**: Transformar em Progressive Web App
- **Backup/Restore**: Exportar/importar dados
- **Integração com pagamentos**: Gateway de pagamento online
