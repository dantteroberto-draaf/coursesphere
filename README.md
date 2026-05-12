# CourseSphere

## 📖 Descrição do Projeto
O CourseSphere é uma plataforma full-stack desenvolvida para o gerenciamento e visualização de cursos e conteúdos educacionais. A aplicação utiliza uma arquitetura moderna com **Ruby on Rails** no backend, servindo uma API robusta, e **React** no frontend para uma experiência de usuário fluida e responsiva.

## 🐳 Docker (Banco de Dados)
O projeto utiliza Docker para facilitar a configuração do ambiente de desenvolvimento, garantindo que o banco de dados PostgreSQL esteja pronto para uso sem configurações manuais complexas.

Para subir o banco de dados, execute o comando abaixo na raiz do projeto:
```bash
docker compose up -d

```

*Certifique-se de que o Docker Desktop ou o daemon do Docker esteja rodando em sua máquina.*

## ⚙️ Passo a passo para rodar o Backend

Após garantir que o container do banco de dados está ativo, siga estas instruções:

1. **Acesse a pasta do backend:**
```bash
cd backend

```


2. **Instale as dependências (Gems):**
```bash
bundle install

```


3. **Configure o banco de dados (Criação, Migrações e Seeds):**
```bash
rails db:create db:migrate

```


4. **Inicie o servidor do Rails:**
```bash
rails server

```



O backend estará rodando por padrão em `http://localhost:3000`.

## 💻 Passo a passo para rodar o Frontend

Em um novo terminal, siga os passos abaixo para iniciar a interface:

1. **Acesse a pasta do frontend:**
```bash
cd frontend

```


2. **Instale as dependências do Node:**
```bash
npm install

```


3. **Inicie o ambiente de desenvolvimento:**
```bash
npm run dev

```



*(Caso seu projeto não use Vite, o comando pode ser `npm start`).* A aplicação abrirá em seu navegador no endereço indicado (geralmente `http://localhost:5173` ou `http://localhost:3000`).


## 🚀 Informações Adicionais

* **Deploy:** No momento, este projeto não possui versão em produção (No deploy).
* **Requisitos:** Ruby (versão recomendada 4.0.3), Node.js, Docker e Git.

```

```
