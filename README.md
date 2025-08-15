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

### ✅ Progressive Web App (PWA)

- **App instalável**: Funciona como aplicativo nativo
- **Funcionamento offline**: Cache inteligente de recursos
- **Service Worker**: Atualizações automáticas
- **Manifest**: Configuração completa com ícones
- **Prompt de instalação**: Interface para adicionar à tela inicial

### ✅ Dashboard e Relatórios

- **Métricas principais**: KPIs em layout horizontal responsivo
- **Análise de receita**: Tracking por período com valores em R$
- **Serviços populares**: Ranking com gráficos de barras
- **Clientes ativos**: Lista dos mais engajados
- **Distribuição semanal**: Análise por dia da semana
- **Crescimento mensal**: Tendências dos últimos 6 meses
- **Design responsivo**: Adaptável para mobile e desktop

### ✅ Deploy e Acesso

- **GitHub Actions**: Deploy automático configurado
- **GitHub Pages**: Site publicado automaticamente
- **Link de acesso**: https://menthorz.github.io/Model-Vue-Site/

## 🛠️ Tecnologias

- **Vue 3** + Composition API
- **Vite** para build otimizado + PWA plugin
- **Pinia** para gerenciamento de estado
- **Vue Router** para navegação
- **CSS Tokens** para sistema de tema
- **LocalStorage API** para persistência
- **Service Worker** para funcionalidade offline
- **Web App Manifest** para instalação PWA

## 🏃‍♂️ Executar Localmente

```sh
npm install
npm run dev
```

Acesse: http://localhost:5173

## 🎯 Próximos Passos

As seguintes funcionalidades ainda podem ser implementadas:

- **Backend Integration**: Conectar com API REST Node.js/Express
- **Notificações Push**: Sistema de lembretes por email/SMS e push notifications
- **Calendário avançado**: Visualização mensal com drag-and-drop de agendamentos
- **Multi-tenancy**: Suporte para múltiplas lojas no mesmo sistema
- **Backup/Restore**: Exportar/importar dados em JSON/CSV
- **Integração com pagamentos**: Gateway de pagamento online (Stripe, PagSeguro)
- **Geolocalização**: Mapa com localização da loja e clientes próximos
- **Chat em tempo real**: Sistema de mensagens entre cliente e loja
- **Integração com redes sociais**: Login social e compartilhamento
- **API de terceiros**: Integração com sistemas de estoque/financeiro
