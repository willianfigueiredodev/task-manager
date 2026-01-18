# 🚀 Task Manager Full Stack

> Um gerenciador de tarefas moderno, com foco em UX/UI, modo escuro e arquitetura robusta.

![Project Status](https://img.shields.io/badge/status-completed-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## 📸 Screenshots

*(Coloque aqui prints do projeto: Tela de Onboarding, Modo Escuro e Modo Claro)*

## 🛠️ Tecnologias Utilizadas

O projeto foi desenvolvido utilizando as melhores práticas de mercado, separando responsabilidades entre Backend e Frontend.

### Frontend (Client-side)
* ⚛️ **React + TypeScript** (via Vite) - Performance e tipagem estática.
* 🎨 **Tailwind CSS** - Estilização moderna e responsiva.
* ✨ **Framer Motion** - Animações fluidas e transições de tela.
* 📡 **Axios** - Comunicação com a API.
* 🖼️ **Lucide React** - Ícones leves e elegantes.

### Backend (Server-side)
* 🐍 **Python + FastAPI** - Framework assíncrono de alta performance.
* 🏗️ **Arquitetura em Camadas** - Organizado em `Routers`, `Services`, `Repositories` e `Models`.
* 🗃️ **SQLAlchemy** - ORM para manipulação do banco de dados.
* ✅ **Pydantic** - Validação de dados e Schemas.

### Infraestrutura & DevOps
* 🐳 **Docker & Docker Compose** - Containerização do Banco de Dados e API.
* 🐘 **PostgreSQL** - Banco de dados relacional robusto.

---

## ✨ Funcionalidades

### UX/UI (Experiência do Usuário)
* **Onboarding Personalizado:** Tela de boas-vindas que pergunta e salva o nome do usuário (Persistência via LocalStorage).
* **Dark & Light Mode:** Alternância de temas com apenas um clique.
* **Design Mobile-First:** Interface responsiva que se adapta a celulares e desktops.
* **Saudação Dinâmica:** Mensagem ("Bom dia", "Boa tarde") baseada no horário local.
* **Feedback Visual:** Animações ao completar, excluir ou adicionar tarefas.

### Funcionalidades Técnicas
* **CRUD Completo:** Criar, Ler, Atualizar e Deletar tarefas.
* **Filtros Inteligentes:** Visualizar tarefas por status (Todas, Pendentes, Concluídas).
* **API Documentada:** Swagger UI disponível automaticamente.

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos
* Git
* Docker & Docker Compose
* Node.js (para o Frontend)

### 1️⃣ Clonar o repositório
```bash
git clone [https://github.com/willianfigueiredodev/task-manager.git](https://github.com/willianfigueiredodev/task-manager.git)
cd task-manager
