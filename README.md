# TaskFlow

**TaskFlow** é um sistema de gerenciamento de tarefas que visa facilitar a organização e acompanhamento de atividades. O projeto é dividido em frontend e backend, utilizando tecnologias modernas como React, Vite, Node.js, Express e MySQL.

---

## 🚀 Tecnologias Utilizadas

### Frontend
- [React](https://reactjs.org/)
- [React-Bootstrap](https://react-bootstrap.github.io/)
- [Vite](https://vitejs.dev/) (ferramenta de build)
- [npm](https://www.npmjs.com/) (gerenciamento de pacotes)

### Backend
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MySQL](https://www.mysql.com/) (via `mysql2`)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js), [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) (segurança e autenticação JWT)
- [multer](https://github.com/expressjs/multer) (upload de arquivos)
- [dotenv](https://github.com/motdotla/dotenv) (variáveis de ambiente)
- [cors](https://github.com/expressjs/cors) (controle de acesso entre origens)
- [express-validator](https://express-validator.github.io/) (validação de dados)
- [node-cron](https://github.com/node-cron/node-cron) (agendamento de tarefas)
- [nodemailer](https://nodemailer.com/) (envio de e-mails)

---

## 📁 Estrutura do Projeto

```

/frontend   # Código do frontend React
/backend    # Código do backend Node.js/Express
/scripts    # Scripts SQL para criação das tabelas (se houver)

````

---

## ⚙️ Requisitos

- Node.js (versão 16 ou superior recomendada)  
- npm (gerenciador de pacotes do Node.js)  
- MySQL (banco de dados relacional)

---

## 🛠️ Configuração e Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/raysagomes/TaskFlow.git
cd TaskFlow
````

### 2. Configurar o banco de dados

* Instale o MySQL e crie um banco de dados para o projeto (exemplo: `taskflowdb`).
* Execute o script SQL (caso disponível em `/scripts`):

```bash
mysql -u seu_usuario -p taskflowdb < scripts/script-de-criacao-das-tabelas.sql
```

### 3. Configurar o backend

```bash
cd backend
npm install
```

Crie um arquivo `.env` com as seguintes variáveis:

```env
PORT=5000
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=taskflowdb
JWT_SECRET=sua_chave_secreta
EMAIL_HOST=smtp.exemplo.com
EMAIL_PORT=587
EMAIL_USER=seu_email
EMAIL_PASS=sua_senha_email
```

Inicie o servidor backend:

```bash
npm start
```

> O backend estará disponível em `http://localhost:5000`.

### 4. Configurar o frontend

```bash
cd ../frontend
npm install
```

Inicie o servidor frontend:

```bash
npm run dev
```

> O frontend estará disponível em algo como `http://localhost:5173`.

---

## 💻 Uso

* Acesse a interface web pelo navegador: `http://localhost:5173`
* Cadastre-se e faça login para utilizar os recursos protegidos.
* Crie, edite e gerencie suas tarefas com facilidade.

---

## ⚠️ Considerações

* Atualmente **não há testes automatizados** implementados.
* A **documentação interna e comentários** no código podem ser limitados.
* **Variáveis de ambiente** devem ser mantidas seguras e não versionadas.

---

## 📄 Licença

Este projeto está sob a licença ISC. Consulte o arquivo [LICENSE](./LICENSE) para mais detalhes.

```
