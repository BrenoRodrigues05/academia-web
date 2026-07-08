# 🏋️ Academia Web

Frontend da Academia API desenvolvido com React, TypeScript e Material UI.

O projeto segue boas práticas de desenvolvimento, utilizando arquitetura baseada em features, React Router para navegação, Material UI para a interface, ESLint e Prettier para padronização do código e integração com a Academia API para autenticação e gerenciamento da academia.

---

# 🚀 Tecnologias Utilizadas

## Frontend

- React 19
- TypeScript
- Vite
- React Router DOM
- Material UI (MUI)
- Emotion
- ESLint
- Prettier
- npm

---

# 📂 Estrutura do Projeto

```text
src
│
├── api
├── assets
│
├── components
│   ├── common
│   ├── forms
│   ├── layout
│   └── ui
│
├── features
│   ├── auth
│   ├── alunos
│   ├── personais
│   ├── planos
│   ├── matriculas
│   ├── treinos
│   └── exercicios
│
├── hooks
│
├── layouts
│
├── pages
│   ├── auth
│   ├── dashboard
│   └── not-found
│
├── routes
├── services
├── store
├── styles
├── types
├── utils
│
├── App.tsx
└── main.tsx
```

---

# 🏛️ Arquitetura

A aplicação segue uma arquitetura baseada em componentes reutilizáveis e organização por funcionalidades (Feature-Based Architecture).

```text
Pages
    ↓
Layouts
    ↓
Components
    ↓
Services
    ↓
Academia API
```

---

## Responsabilidades

| Camada     | Responsabilidade                  |
| ---------- | --------------------------------- |
| Pages      | Representam as telas da aplicação |
| Layouts    | Estrutura visual reutilizável     |
| Components | Componentes reutilizáveis         |
| Features   | Organização das funcionalidades   |
| Services   | Comunicação com a API             |
| Hooks      | Hooks customizados                |
| Store      | Gerenciamento de estado global    |
| Types      | Tipagens TypeScript               |
| Utils      | Funções utilitárias               |

---

# 🎨 Interface

A interface utiliza Material UI como biblioteca de componentes.

Recursos já implementados:

- Tema Global
- CSS Reset (CssBaseline)
- Paleta de cores centralizada
- Tipografia centralizada
- Layout Base
- Navbar
- Sidebar

---

# 🛣️ Rotas

Atualmente o projeto possui as seguintes rotas:

```text
/
└── Login

/dashboard
└── Dashboard

*
└── Página 404
```

---

# 📋 Estrutura de Layout

```text
┌────────────────────────────────────────────────────┐
│ Navbar                                             │
├────────────────────┬───────────────────────────────┤
│                    │                               │
│ Sidebar            │                               │
│                    │                               │
│                    │          Conteúdo             │
│                    │                               │
│                    │                               │
└────────────────────┴───────────────────────────────┘
```

Este layout será reutilizado em todas as páginas autenticadas da aplicação.

---

# ⚙️ Como Executar

## Clonar o projeto

```bash
git clone https://github.com/BrenoRodrigues05/academia-web.git
```

## Entrar na pasta

```bash
cd academia-web
```

## Instalar dependências

```bash
npm install
```

## Executar

```bash
npm run dev
```

A aplicação ficará disponível em:

```text
http://localhost:5173
```

---

# 🧪 Roadmap

## Estrutura

- ✅ React + TypeScript
- ✅ Vite
- ✅ React Router
- ✅ Material UI
- ✅ Tema Global
- ✅ Layout Base
- ✅ Navbar
- ✅ Sidebar
- ✅ ESLint
- ✅ Prettier

## Autenticação

- ⬜ Login
- ⬜ JWT
- ⬜ Axios
- ⬜ Interceptors
- ⬜ Rotas Protegidas
- ⬜ Persistência da Sessão

## Dashboard

- ⬜ Cards
- ⬜ KPIs
- ⬜ Gráficos

## CRUDs

- ⬜ Alunos
- ⬜ Personais
- ⬜ Planos
- ⬜ Matrículas
- ⬜ Treinos
- ⬜ Exercícios
- ⬜ Itens de Treino

## Melhorias

- ⬜ Dark Mode
- ⬜ Responsividade
- ⬜ TanStack Query
- ⬜ Zustand
- ⬜ React Hook Form
- ⬜ Zod
- ⬜ Paginação
- ⬜ Busca
- ⬜ Filtros
- ⬜ Docker
- ⬜ GitHub Actions
- ⬜ Deploy

---

# 👨‍💻 Autor

## Breno Rodrigues

Desenvolvedor Full Stack

GitHub:

https://github.com/BrenoRodrigues05

---

# ⭐ Projeto em evolução

Este projeto está sendo desenvolvido juntamente com a **Academia API**, seguindo arquitetura moderna, boas práticas de desenvolvimento, componentes reutilizáveis, tipagem forte com TypeScript e padrões utilizados em aplicações React profissionais.
