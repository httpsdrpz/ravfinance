import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { TransactionTypeDto } from './create-transaction.dto';

export class UpdateTransactionDto {
  @ApiPropertyOptional({ enum: TransactionTypeDto, example: TransactionTypeDto.EXPENSE })
  @IsOptional()
  @IsEnum(TransactionTypeDto)
  type?: TransactionTypeDto;

  @ApiPropertyOptional({ example: 'Hospedagem' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title?: string;

  @ApiPropertyOptional({ example: 8900, description: 'Valor em centavos' })
  @IsOptional()
  @IsInt()
  @Min(1)
  amountCents?: number;

  @ApiPropertyOptional({ example: '2026-02-04T12:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  occurredAt?: string;
}
