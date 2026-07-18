# 🏋️ Academia Web

Frontend da **Academia API**, desenvolvido com **React**, **TypeScript** e **Material UI**, seguindo uma arquitetura escalável baseada em **Feature-First**, com componentes reutilizáveis, hooks customizados e foco em responsividade.

O objetivo do projeto é fornecer uma interface moderna para gerenciamento de academias, permitindo administrar alunos, planos, matrículas, personais, treinos e exercícios de forma organizada e intuitiva.

---

# 🚀 Tecnologias Utilizadas

## Frontend

- React 19
- TypeScript
- Vite
- Material UI (MUI)
- React Router DOM
- Axios
- React Hook Form
- Zod
- React Context API

---

# 📂 Estrutura do Projeto

```text
src
│
├── api
│   ├── axios.ts
│   ├── interceptors.ts
│   └── index.ts
│
├── assets
│
├── components
│   ├── common
│   ├── crud
│   ├── feedback
│   ├── form
│   └── layout
│
├── features
│   └── alunos
│       ├── api
│       ├── components
│       ├── hooks
│       ├── mappers
│       ├── pages
│       ├── schemas
│       ├── types
│       └── index.ts
│
├── hooks
│
├── layouts
│
├── providers
│
├── routes
│
├── shared
│   ├── constants
│   ├── enums
│   ├── helpers
│   ├── types
│   ├── utils
│   └── validators
│
├── styles
│
├── App.tsx
└── main.tsx
```

---

# 🏛️ Arquitetura

A aplicação segue uma arquitetura **Feature-First**, onde cada módulo concentra tudo o que é necessário para funcionar.

```text
Feature

↓

API

↓

Hooks

↓

Componentes

↓

Página

↓

Rotas
```

Essa abordagem facilita a manutenção, reutilização de código e evolução do projeto.

---

# 📦 Componentes Reutilizáveis

## CRUD

- CrudPage
- CrudToolbar
- CrudTable
- CrudDialog
- CrudActions
- CrudResponsiveList
- CrudCard

## Formulários

- AppTextField
- AppSelectField
- AppDateField
- AppPhoneField
- AppTextarea

## Feedback

- AppSnackbar
- LoadingOverlay
- EmptyState
- ErrorState
- ConfirmDialog

---

# 📱 Responsividade

O projeto foi desenvolvido com foco em dispositivos móveis.

### Desktop

- Tabelas completas
- Sidebar expandida
- Layout otimizado para telas grandes

### Mobile

- Cards responsivos
- Drawer lateral
- Componentes adaptados para toque
- Layout otimizado para telas pequenas

---

# 🔄 Comunicação com a API

A comunicação é realizada utilizando **Axios**, com uma instância centralizada.

Recursos implementados:

- Base URL configurável por variável de ambiente
- Interceptors para requisições e respostas
- Tratamento centralizado de erros
- Preparação para autenticação JWT

---

# 🔐 Autenticação

Estrutura preparada para:

- Login
- JWT
- Refresh Token
- Rotas protegidas
- Controle de permissões

---

# 📋 Funcionalidades Implementadas

## Alunos

- Listagem paginada
- Cadastro
- Edição
- Exclusão
- Busca
- Validação de formulários
- Feedback visual
- Responsividade

---

# 🎯 Padrões Utilizados

- Feature-First Architecture
- Componentes reutilizáveis
- Hooks customizados
- Barrel Files
- Context API
- Providers centralizados
- Layouts reutilizáveis
- Responsividade Mobile First

---

# 🛣️ Roadmap

## Em desenvolvimento

- Personais
- Planos
- Matrículas
- Exercícios
- Treinos
- Dashboard
- Autenticação JWT
- Controle de permissões
- Tema Dark Mode
- Testes automatizados

---

# ⚙️ Como Executar

## Clonar o projeto

```bash
git clone https://github.com/BrenoRodrigues05/academia-web.git
```

## Instalar dependências

```bash
npm install
```

## Executar

```bash
npm run dev
```

---

# 👨‍💻 Autor

## Breno Rodrigues

Desenvolvedor Full Stack

Portfólio:

https://www.brenorodriguesdev.com.br/

---

# ⭐ Projeto em evolução

Este projeto está sendo desenvolvido com foco em aprendizado contínuo, aplicação de boas práticas e construção de uma arquitetura moderna para aplicações React escaláveis.
