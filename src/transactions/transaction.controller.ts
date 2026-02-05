import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionQueryDto } from './dto/transaction-query.dto';
import { TransactionSummaryQueryDto } from './dto/transaction-summary-query.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly service: TransactionService) {}

  @Post()
  create(@Body() dto: CreateTransactionDto) {
    return this.service.create(dto);
  }

  @Get()
  list(@Query() query: TransactionQueryDto) {
    return this.service.findAll(query);
  }

  @Get('summary')
  summary(@Query() query: TransactionSummaryQueryDto) {
    return this.service.summary(query);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTransactionDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
