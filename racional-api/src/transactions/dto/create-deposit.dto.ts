import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateDepositDto {
  @ApiProperty({ example: 'portfolio-abc123' })
  @IsString()
  portfolioId: string;

  @ApiProperty({ example: 'user-xyz789' })
  @IsString()
  userId: string;

  @ApiProperty({ example: 500000, description: 'Amount must be greater than 0' })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ example: '2025-06-15T12:00:00Z', description: 'ISO 8601 date string' })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({ example: 'Monthly deposit' })
  @IsOptional()
  @IsString()
  notes?: string;
}
