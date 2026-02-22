import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum PortfolioCurrency {
  CLP = 'CLP',
  USD = 'USD',
}

export class UpdatePortfolioDto {
  @ApiPropertyOptional({ example: 'My Growth Portfolio' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ enum: PortfolioCurrency, example: PortfolioCurrency.CLP })
  @IsOptional()
  @IsEnum(PortfolioCurrency)
  currency?: PortfolioCurrency;
}
