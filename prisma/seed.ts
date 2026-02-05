import { PrismaClient, TransactionType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.transaction.deleteMany();

  await prisma.transaction.createMany({
    data: [
      {
        type: TransactionType.INCOME,
        title: 'Assinaturas SaaS',
        amountCents: 125000,
        occurredAt: new Date('2026-02-01T12:00:00.000Z'),
      },
      {
        type: TransactionType.INCOME,
        title: 'Consultoria',
        amountCents: 45000,
        occurredAt: new Date('2026-02-03T12:00:00.000Z'),
      },
      {
        type: TransactionType.EXPENSE,
        title: 'Infra cloud',
        amountCents: 18000,
        occurredAt: new Date('2026-02-02T12:00:00.000Z'),
      },
      {
        type: TransactionType.EXPENSE,
        title: 'Marketing',
        amountCents: 23000,
        occurredAt: new Date('2026-02-04T12:00:00.000Z'),
      },
      {
        type: TransactionType.EXPENSE,
        title: 'Software',
        amountCents: 9500,
        occurredAt: new Date('2026-02-05T12:00:00.000Z'),
      }
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
