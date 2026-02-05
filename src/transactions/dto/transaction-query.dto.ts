import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { TransactionTypeDto } from './create-transaction.dto';

export class TransactionQueryDto {
  @ApiPropertyOptional({ enum: TransactionTypeDto, example: TransactionTypeDto.INCOME })
  @IsOptional()
  @IsEnum(TransactionTypeDto)
  type?: TransactionTypeDto;

  @ApiPropertyOptional({ example: '2026-02-01' })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({ example: '2026-02-28' })
  @IsOptional()
  @IsDateString()
  to?: string;

  @ApiPropertyOptional({ example: 'SaaS' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  search?: string;
}
