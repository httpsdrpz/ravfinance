import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, TransactionType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionQueryDto } from './dto/transaction-query.dto';
import { TransactionSummaryQueryDto } from './dto/transaction-summary-query.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateTransactionDto) {
    return this.prisma.transaction.create({
      data: {
        type: dto.type,
        title: dto.title,
        amountCents: dto.amountCents,
        occurredAt: this.parseDate(dto.occurredAt),
      },
    });
  }

  findAll(filters: TransactionQueryDto = {}) {
    const where = this.buildWhere(filters);

    return this.prisma.transaction.findMany({
      where,
      orderBy: [{ occurredAt: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async summary(filters: TransactionSummaryQueryDto = {}) {
    const where = this.buildDateWhere(filters);

    const [income, expense] = await this.prisma.$transaction([
      this.prisma.transaction.aggregate({
        where: { ...where, type: TransactionType.INCOME },
        _sum: { amountCents: true },
      }),
      this.prisma.transaction.aggregate({
        where: { ...where, type: TransactionType.EXPENSE },
        _sum: { amountCents: true },
      }),
    ]);

    const incomeCents = income._sum.amountCents ?? 0;
    const expenseCents = expense._sum.amountCents ?? 0;

    return {
      incomeCents,
      expenseCents,
      balanceCents: incomeCents - expenseCents,
    };
  }

  async findOne(id: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async update(id: string, dto: UpdateTransactionDto) {
    await this.ensureExists(id);

    return this.prisma.transaction.update({
      where: { id },
      data: {
        type: dto.type,
        title: dto.title,
        amountCents: dto.amountCents,
        occurredAt: dto.occurredAt ? new Date(dto.occurredAt) : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);

    return this.prisma.transaction.delete({
      where: { id },
    });
  }

  private buildWhere(filters: TransactionQueryDto) {
    const where: Prisma.TransactionWhereInput = {};

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.search?.trim()) {
      where.title = {
        contains: filters.search.trim(),
        mode: 'insensitive',
      };
    }

    this.applyDateRange(where, filters.from, filters.to);

    return where;
  }

  private buildDateWhere(filters: TransactionSummaryQueryDto) {
    const where: Prisma.TransactionWhereInput = {};
    this.applyDateRange(where, filters.from, filters.to);
    return where;
  }

  private applyDateRange(where: Prisma.TransactionWhereInput, from?: string, to?: string) {
    if (!from && !to) {
      return;
    }

    where.occurredAt = {};
    if (from) {
      where.occurredAt.gte = new Date(from);
    }
    if (to) {
      where.occurredAt.lte = new Date(to);
    }
  }

  private async ensureExists(id: string) {
    const existing = await this.prisma.transaction.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundException('Transaction not found');
    }
  }

  private parseDate(date: string): Date {
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) {
      throw new BadRequestException('Invalid date format');
    }
    return parsed;
  }
}
