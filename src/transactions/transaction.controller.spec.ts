import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto, TransactionTypeDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionQueryDto } from './dto/transaction-query.dto';
import { TransactionSummaryQueryDto } from './dto/transaction-summary-query.dto';

describe('TransactionController', () => {
  let controller: TransactionController;
  let service: TransactionService;

  const mockTransactionService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    summary: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: mockTransactionService,
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    service = module.get<TransactionService>(TransactionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a transaction', async () => {
      const dto: CreateTransactionDto = {
        type: TransactionTypeDto.INCOME,
        title: 'Salary',
        amountCents: 500000,
        occurredAt: '2026-02-01T00:00:00.000Z',
      };

      const expectedResult = {
        id: '1',
        ...dto,
        occurredAt: new Date(dto.occurredAt),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTransactionService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(dto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('list', () => {
    it('should return an array of transactions', async () => {
      const query: TransactionQueryDto = {};
      const expectedResult = [
        {
          id: '1',
          type: 'INCOME',
          title: 'Salary',
          amountCents: 500000,
          occurredAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockTransactionService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.list(query);

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return filtered transactions', async () => {
      const query: TransactionQueryDto = {
        type: TransactionTypeDto.EXPENSE,
        search: 'food',
      };

      const expectedResult = [
        {
          id: '1',
          type: 'EXPENSE',
          title: 'Food market',
          amountCents: 15000,
          occurredAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockTransactionService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.list(query);

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('summary', () => {
    it('should return financial summary', async () => {
      const query: TransactionSummaryQueryDto = {};
      const expectedResult = {
        incomeCents: 500000,
        expenseCents: 200000,
        balanceCents: 300000,
      };

      mockTransactionService.summary.mockResolvedValue(expectedResult);

      const result = await controller.summary(query);

      expect(result).toEqual(expectedResult);
      expect(service.summary).toHaveBeenCalledWith(query);
      expect(service.summary).toHaveBeenCalledTimes(1);
    });

    it('should return summary with date filters', async () => {
      const query: TransactionSummaryQueryDto = {
        from: '2026-01-01',
        to: '2026-01-31',
      };

      const expectedResult = {
        incomeCents: 100000,
        expenseCents: 50000,
        balanceCents: 50000,
      };

      mockTransactionService.summary.mockResolvedValue(expectedResult);

      const result = await controller.summary(query);

      expect(result).toEqual(expectedResult);
      expect(service.summary).toHaveBeenCalledWith(query);
    });
  });

  describe('getById', () => {
    it('should return a transaction by id', async () => {
      const id = '1';
      const expectedResult = {
        id,
        type: 'INCOME',
        title: 'Salary',
        amountCents: 500000,
        occurredAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTransactionService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.getById(id);

      expect(result).toEqual(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update a transaction', async () => {
      const id = '1';
      const dto: UpdateTransactionDto = {
        title: 'Updated Salary',
        amountCents: 600000,
      };

      const expectedResult = {
        id,
        type: 'INCOME',
        ...dto,
        occurredAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTransactionService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(id, dto);

      expect(result).toEqual(expectedResult);
      expect(service.update).toHaveBeenCalledWith(id, dto);
      expect(service.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should delete a transaction', async () => {
      const id = '1';
      const expectedResult = {
        id,
        type: 'INCOME',
        title: 'Salary',
        amountCents: 500000,
        occurredAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTransactionService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(id);

      expect(result).toEqual(expectedResult);
      expect(service.remove).toHaveBeenCalledWith(id);
      expect(service.remove).toHaveBeenCalledTimes(1);
    });
  });
});
