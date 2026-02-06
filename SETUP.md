# RAV Finance API - Setup Guide

## 🚀 Setup Rápido para Desenvolvedores

### 1. Instalar Dependências

```bash
cd apps/api
npm install
```

### 2. Configurar Banco de Dados (Neon)

Cada desenvolvedor pode ter seu próprio banco ou compartilhar:

#### Opção A: Criar seu próprio banco (Recomendado)
1. Acesse [console.neon.tech](https://console.neon.tech)
2. Crie uma conta (gratuita)
3. Crie um novo projeto PostgreSQL
4. Copie a connection string

#### Opção B: Usar banco compartilhado
Peça a connection string para o time

### 3. Configurar Variáveis de Ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o .env e cole sua DATABASE_URL do Neon
```

Exemplo de `.env`:
```
DATABASE_URL="postgresql://user:pass@ep-xxx.region.aws.neon.tech/ravfinance?sslmode=require"
API_PORT=3333
NODE_ENV=development
```

### 4. Rodar Migrations do Prisma

```bash
# Aplicar migrations no banco
npx prisma migrate deploy

# OU se precisar resetar o banco
npx prisma migrate reset

# Gerar Prisma Client
npx prisma generate
```

### 5. (Opcional) Popular Banco com Dados de Teste

```bash
npm run db:seed
```

### 6. Rodar a API

```bash
# Modo desenvolvimento (com hot-reload)
npm run start:dev

# OU modo normal
npm start
```

A API estará rodando em: http://localhost:3333

### 7. Acessar Documentação Swagger

Abra no navegador: http://localhost:3333/api/docs

---

## 🧪 Rodar Testes

```bash
# Todos os testes
npm test

# Testes em watch mode
npm run test:watch

# Testes com coverage
npm run test:cov
```

---

## 📦 Deploy na Vercel

### Deploy Manual

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer deploy
vercel
```

### Deploy Automático (GitHub)

1. Conecte o repositório no [vercel.com](https://vercel.com)
2. Adicione a variável de ambiente `DATABASE_URL` nas configurações
3. Commits na branch `main` farão deploy automático

**Importante**: Configure as variáveis de ambiente na Vercel:
- `DATABASE_URL` - sua connection string do Neon (produção)

---

## 🔧 Comandos Úteis

```bash
# Formatar código
npm run format

# Lint
npm run lint

# Build
npm run build

# Visualizar banco de dados no Prisma Studio
npx prisma studio
```

---

## 🐛 Troubleshooting

### Erro de conexão com banco
- Verifique se a `DATABASE_URL` está correta no `.env`
- Certifique-se de que tem `?sslmode=require` no final da URL do Neon

### Prisma Client não encontrado
```bash
npx prisma generate
```

### Migrations desatualizadas
```bash
npx prisma migrate deploy
```

---

## 📝 Estrutura do Projeto

```
apps/api/
├── src/
│   ├── health/           # Health check endpoint
│   ├── transactions/     # Módulo de transações
│   ├── prisma/          # Prisma service
│   ├── app.module.ts    # Módulo principal
│   └── main.ts          # Entry point
├── prisma/
│   └── schema.prisma    # Database schema
├── test/                # E2E tests
└── package.json
```

---

## 🤝 Workflow de Desenvolvimento

1. Crie uma branch para sua feature
2. Desenvolva e teste localmente
3. Rode os testes: `npm test`
4. Commit e push
5. Abra um Pull Request
6. Após merge, deploy automático na Vercel

---

## 💡 Dicas

- Use o Prisma Studio para visualizar dados: `npx prisma studio`
- A documentação Swagger sempre está atualizada em `/api/docs`
- Todos os endpoints têm prefixo `/api`
- Cada desenvolvedor pode ter seu próprio banco Neon (tier gratuito)
