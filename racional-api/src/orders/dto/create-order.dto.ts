import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNumber, IsString, Min } from 'class-validator';

export enum OrderType {
  BUY = 'BUY',
  SELL = 'SELL',
}

export class CreateOrderDto {
  @ApiProperty({ example: 'portfolio-abc123' })
  @IsString()
  portfolioId: string;

  @ApiProperty({ example: 'user-xyz789' })
  @IsString()
  userId: string;

  @ApiProperty({ example: 'AAPL' })
  @IsString()
  ticker: string;

  @ApiProperty({ enum: OrderType, example: OrderType.BUY })
  @IsEnum(OrderType)
  type: OrderType;

  @ApiProperty({ example: 10, description: 'Quantity must be greater than 0' })
  @IsNumber()
  @Min(0.01)
  quantity: number;

  @ApiProperty({ example: 150.5, description: 'Price must be greater than 0' })
  @IsNumber()
  @Min(0.01)
  price: number;

  @ApiProperty({ example: '2025-06-15T14:30:00Z', description: 'ISO 8601 date string' })
  @IsDateString()
  date: string;
}
