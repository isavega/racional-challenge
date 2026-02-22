import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateWithdrawalDto {
  @ApiProperty({ example: 'portfolio-abc123' })
  @IsString()
  portfolioId: string;

  @ApiProperty({ example: 'user-xyz789' })
  @IsString()
  userId: string;

  @ApiProperty({ example: 100000, description: 'Amount must be greater than 0' })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ example: '2025-06-20T12:00:00Z', description: 'ISO 8601 date string' })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({ example: 'Emergency fund' })
  @IsOptional()
  @IsString()
  notes?: string;
}
