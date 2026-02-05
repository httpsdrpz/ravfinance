import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export enum TransactionTypeDto {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export class CreateTransactionDto {
  @ApiProperty({ enum: TransactionTypeDto, example: TransactionTypeDto.INCOME })
  @IsEnum(TransactionTypeDto)
  type: TransactionTypeDto;

  @ApiProperty({ example: 'Assinatura SaaS' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title: string;

  @ApiProperty({ example: 12000, description: 'Valor em centavos' })
  @IsInt()
  @Min(1)
  amountCents: number;

  @ApiProperty({ example: '2026-02-04T12:00:00.000Z' })
  @IsDateString()
  occurredAt: string;
}
