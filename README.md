# 💰 RAV Finance API

Sistema financeiro enxuto para founders - gerencie receitas, despesas e acompanhe seu fluxo de caixa.

## 🚀 Quick Start

```bash
# 1. Instalar dependências
npm install

# 2. Configurar ambiente (veja SETUP.md para detalhes)
cp .env.example .env
# Edite .env com sua DATABASE_URL do Neon

# 3. Rodar migrations
npx prisma migrate deploy
npx prisma generate

# 4. Iniciar API
npm run start:dev
```

A API estará disponível em: **http://localhost:3333**

📚 **Documentação completa:** [SETUP.md](./SETUP.md)

---

## 📖 Documentação da API

Acesse a documentação interativa Swagger:

**http://localhost:3333/api/docs**

Todas as rotas possuem prefixo `/api`:
- `GET /api/health` - Status da API
- `GET /api/transactions` - Listar transações
- `POST /api/transactions` - Criar transação
- `GET /api/transactions/summary` - Resumo financeiro
- E mais...

---

## 🏗️ Stack Tecnológica

- **Framework:** NestJS 11
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma
- **Documentação:** Swagger/OpenAPI
- **Testes:** Jest (36 testes unitários)
- **Deploy:** Vercel

---

## 🧪 Testes

```bash
# Rodar todos os testes
npm test

# Testes com watch mode
npm run test:watch

# Cobertura de testes
npm run test:cov
```

**Cobertura atual:** 36 testes passando ✅

---

## 📁 Estrutura do Projeto

```
src/
├── health/              # Health check endpoint
│   ├── health.controller.ts
│   └── health.controller.spec.ts
├── transactions/        # Transações financeiras
│   ├── dto/            # Data Transfer Objects
│   ├── transaction.controller.ts
│   ├── transaction.service.ts
│   └── *.spec.ts       # Testes unitários
├── prisma/             # Database service
│   ├── prisma.service.ts
│   └── prisma.module.ts
├── app.module.ts       # Módulo raiz
└── main.ts            # Entry point
```

---

## 🌐 Deploy

### Vercel (Recomendado)

```bash
# Deploy manual
vercel

# OU conecte seu repo no GitHub
# Deploy automático em cada push para main
```

**Importante:** Configure a variável `DATABASE_URL` na Vercel.

---

## 🛠️ Comandos Úteis

```bash
npm run start:dev      # Dev mode com hot-reload
npm run build         # Build para produção
npm run lint          # Lint código
npm run format        # Formatar código
npx prisma studio     # Abrir Prisma Studio (GUI do banco)
npx prisma migrate    # Gerenciar migrations
```

---

## 📦 Features

- ✅ CRUD completo de transações
- ✅ Filtros por tipo, data e busca
- ✅ Resumo financeiro (receitas, despesas, saldo)
- ✅ Validação de dados com class-validator
- ✅ Documentação Swagger automática
- ✅ Health check endpoint
- ✅ Testes unitários completos
- ✅ Deploy simplificado na Vercel
- ✅ PostgreSQL serverless (Neon)

---

## 🤝 Desenvolvimento em Time

Cada desenvolvedor pode:
- Ter seu próprio banco Neon (gratuito)
- OU usar banco compartilhado do time
- Rodar localmente sem Docker
- Deploy individual na Vercel para testes

Veja [SETUP.md](./SETUP.md) para instruções detalhadas.

---

## 📝 Variáveis de Ambiente

```env
DATABASE_URL="postgresql://..."  # Connection string do Neon
API_PORT=3333                    # Porta da API (opcional)
NODE_ENV=development             # Ambiente
```

---

## 🐛 Troubleshooting

Consulte a seção de troubleshooting no [SETUP.md](./SETUP.md#-troubleshooting)

---

## 📄 Licença

UNLICENSED - Uso privado
