import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto, TransactionTypeDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionQueryDto } from './dto/transaction-query.dto';
import { TransactionType } from '@prisma/client';

describe('TransactionService', () => {
  let service: TransactionService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    transaction: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      aggregate: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a transaction successfully', async () => {
      const dto: CreateTransactionDto = {
        type: TransactionTypeDto.INCOME,
        title: 'Salary',
        amountCents: 500000,
        occurredAt: '2026-02-01T00:00:00.000Z',
      };

      const expectedResult = {
        id: '1',
        type: TransactionType.INCOME,
        title: 'Salary',
        amountCents: 500000,
        occurredAt: new Date('2026-02-01T00:00:00.000Z'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.transaction.create.mockResolvedValue(expectedResult);

      const result = await service.create(dto);

      expect(result).toEqual(expectedResult);
      expect(prismaService.transaction.create).toHaveBeenCalledWith({
        data: {
          type: dto.type,
          title: dto.title,
          amountCents: dto.amountCents,
          occurredAt: new Date(dto.occurredAt),
        },
      });
    });

    it('should throw BadRequestException for invalid date', async () => {
      const dto: CreateTransactionDto = {
        type: TransactionTypeDto.INCOME,
        title: 'Salary',
        amountCents: 500000,
        occurredAt: 'invalid-date',
      };

      try {
        await service.create(dto);
        fail('Expected BadRequestException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Invalid date format: invalid-date');
      }
    });
  });

  describe('findAll', () => {
    it('should return all transactions', async () => {
      const expectedResult = [
        {
          id: '1',
          type: TransactionType.INCOME,
          title: 'Salary',
          amountCents: 500000,
          occurredAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.transaction.findMany.mockResolvedValue(expectedResult);

      const result = await service.findAll({});

      expect(result).toEqual(expectedResult);
      expect(prismaService.transaction.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: [{ occurredAt: 'desc' }, { createdAt: 'desc' }],
      });
    });

    it('should filter transactions by type', async () => {
      const query: TransactionQueryDto = {
        type: TransactionTypeDto.EXPENSE,
      };

      mockPrismaService.transaction.findMany.mockResolvedValue([]);

      await service.findAll(query);

      expect(prismaService.transaction.findMany).toHaveBeenCalledWith({
        where: { type: TransactionTypeDto.EXPENSE },
        orderBy: [{ occurredAt: 'desc' }, { createdAt: 'desc' }],
      });
    });

    it('should filter transactions by search term', async () => {
      const query: TransactionQueryDto = {
        search: 'food',
      };

      mockPrismaService.transaction.findMany.mockResolvedValue([]);

      await service.findAll(query);

      expect(prismaService.transaction.findMany).toHaveBeenCalledWith({
        where: {
          title: {
            contains: 'food',
            mode: 'insensitive',
          },
        },
        orderBy: [{ occurredAt: 'desc' }, { createdAt: 'desc' }],
      });
    });

    it('should filter transactions by date range', async () => {
      const query: TransactionQueryDto = {
        from: '2026-01-01',
        to: '2026-01-31',
      };

      mockPrismaService.transaction.findMany.mockResolvedValue([]);

      await service.findAll(query);

      expect(prismaService.transaction.findMany).toHaveBeenCalledWith({
        where: {
          occurredAt: {
            gte: new Date('2026-01-01'),
            lte: new Date('2026-01-31'),
          },
        },
        orderBy: [{ occurredAt: 'desc' }, { createdAt: 'desc' }],
      });
    });

    it('should trim whitespace from search term', async () => {
      const query: TransactionQueryDto = {
        search: '  food  ',
      };

      mockPrismaService.transaction.findMany.mockResolvedValue([]);

      await service.findAll(query);

      expect(prismaService.transaction.findMany).toHaveBeenCalledWith({
        where: {
          title: {
            contains: 'food',
            mode: 'insensitive',
          },
        },
        orderBy: [{ occurredAt: 'desc' }, { createdAt: 'desc' }],
      });
    });
  });

  describe('summary', () => {
    it('should return financial summary', async () => {
      const incomeResult = { _sum: { amountCents: 500000 } };
      const expenseResult = { _sum: { amountCents: 200000 } };

      mockPrismaService.$transaction.mockResolvedValue([incomeResult, expenseResult]);

      const result = await service.summary({});

      expect(result).toEqual({
        incomeCents: 500000,
        expenseCents: 200000,
        balanceCents: 300000,
      });
    });

    it('should handle null sums from database', async () => {
      const incomeResult = { _sum: { amountCents: null } };
      const expenseResult = { _sum: { amountCents: null } };

      mockPrismaService.$transaction.mockResolvedValue([incomeResult, expenseResult]);

      const result = await service.summary({});

      expect(result).toEqual({
        incomeCents: 0,
        expenseCents: 0,
        balanceCents: 0,
      });
    });

    it('should filter summary by date range', async () => {
      const incomeResult = { _sum: { amountCents: 100000 } };
      const expenseResult = { _sum: { amountCents: 50000 } };

      mockPrismaService.$transaction.mockResolvedValue([incomeResult, expenseResult]);

      const result = await service.summary({
        from: '2026-01-01',
        to: '2026-01-31',
      });

      expect(result).toEqual({
        incomeCents: 100000,
        expenseCents: 50000,
        balanceCents: 50000,
      });
    });
  });

  describe('findOne', () => {
    it('should return a transaction by id', async () => {
      const id = '1';
      const expectedResult = {
        id,
        type: TransactionType.INCOME,
        title: 'Salary',
        amountCents: 500000,
        occurredAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.transaction.findUnique.mockResolvedValue(expectedResult);

      const result = await service.findOne(id);

      expect(result).toEqual(expectedResult);
      expect(prismaService.transaction.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
    });

    it('should throw NotFoundException when transaction not found', async () => {
      const id = 'non-existent';

      mockPrismaService.transaction.findUnique.mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(id)).rejects.toThrow('Transaction not found');
    });
  });

  describe('update', () => {
    it('should update a transaction successfully', async () => {
      const id = '1';
      const dto: UpdateTransactionDto = {
        title: 'Updated Salary',
        amountCents: 600000,
      };

      const existingTransaction = { id };
      const expectedResult = {
        id,
        type: TransactionType.INCOME,
        title: 'Updated Salary',
        amountCents: 600000,
        occurredAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.transaction.findUnique.mockResolvedValue(existingTransaction);
      mockPrismaService.transaction.update.mockResolvedValue(expectedResult);

      const result = await service.update(id, dto);

      expect(result).toEqual(expectedResult);
      expect(prismaService.transaction.update).toHaveBeenCalledWith({
        where: { id },
        data: {
          type: dto.type,
          title: dto.title,
          amountCents: dto.amountCents,
          occurredAt: undefined,
        },
      });
    });

    it('should throw NotFoundException when updating non-existent transaction', async () => {
      const id = 'non-existent';
      const dto: UpdateTransactionDto = {
        title: 'Updated',
      };

      mockPrismaService.transaction.findUnique.mockResolvedValue(null);

      await expect(service.update(id, dto)).rejects.toThrow(NotFoundException);
      await expect(service.update(id, dto)).rejects.toThrow('Transaction not found');
    });

    it('should update with new date when provided', async () => {
      const id = '1';
      const dto: UpdateTransactionDto = {
        occurredAt: '2026-02-15T00:00:00.000Z',
      };

      const existingTransaction = { id };

      mockPrismaService.transaction.findUnique.mockResolvedValue(existingTransaction);
      mockPrismaService.transaction.update.mockResolvedValue({} as any);

      await service.update(id, dto);

      expect(prismaService.transaction.update).toHaveBeenCalledWith({
        where: { id },
        data: {
          type: undefined,
          title: undefined,
          amountCents: undefined,
          occurredAt: new Date('2026-02-15T00:00:00.000Z'),
        },
      });
    });
  });

  describe('remove', () => {
    it('should delete a transaction successfully', async () => {
      const id = '1';
      const existingTransaction = { id };
      const expectedResult = {
        id,
        type: TransactionType.INCOME,
        title: 'Salary',
        amountCents: 500000,
        occurredAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.transaction.findUnique.mockResolvedValue(existingTransaction);
      mockPrismaService.transaction.delete.mockResolvedValue(expectedResult);

      const result = await service.remove(id);

      expect(result).toEqual(expectedResult);
      expect(prismaService.transaction.delete).toHaveBeenCalledWith({
        where: { id },
      });
    });

    it('should throw NotFoundException when deleting non-existent transaction', async () => {
      const id = 'non-existent';

      mockPrismaService.transaction.findUnique.mockResolvedValue(null);

      await expect(service.remove(id)).rejects.toThrow(NotFoundException);
      await expect(service.remove(id)).rejects.toThrow('Transaction not found');
    });
  });
});
