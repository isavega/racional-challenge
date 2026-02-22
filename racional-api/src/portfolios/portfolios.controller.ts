import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { PortfoliosService } from './portfolios.service.js';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto.js';
import { MovementsQueryDto } from './dto/movements-query.dto.js';

@ApiTags('Portfolios')
@ApiSecurity('api-key')
@Controller('portfolios')
export class PortfoliosController {
  constructor(private readonly portfoliosService: PortfoliosService) {}

  @Patch(':id')
  @ApiOperation({ summary: 'Update portfolio information' })
  @ApiResponse({ status: 200, description: 'Portfolio updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Invalid or missing API key' })
  @ApiResponse({ status: 404, description: 'Portfolio not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async update(@Param('id') id: string, @Body() dto: UpdatePortfolioDto) {
    const data = await this.portfoliosService.update(id, dto);
    return { success: true, data, message: 'Portfolio updated successfully' };
  }

  @Get(':id/summary')
  @ApiOperation({ summary: 'Get portfolio summary with balances' })
  @ApiResponse({ status: 200, description: 'Portfolio summary retrieved' })
  @ApiResponse({ status: 401, description: 'Invalid or missing API key' })
  @ApiResponse({ status: 404, description: 'Portfolio not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getSummary(@Param('id') id: string) {
    const data = await this.portfoliosService.getSummary(id);
    return { success: true, data, message: 'Portfolio summary retrieved' };
  }

  @Get(':id/movements')
  @ApiOperation({ summary: 'Get paginated portfolio movements (transactions + orders)' })
  @ApiResponse({ status: 200, description: 'Portfolio movements retrieved' })
  @ApiResponse({ status: 400, description: 'Invalid query parameters' })
  @ApiResponse({ status: 401, description: 'Invalid or missing API key' })
  @ApiResponse({ status: 404, description: 'Portfolio not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getMovements(
    @Param('id') id: string,
    @Query() query: MovementsQueryDto,
  ) {
    const data = await this.portfoliosService.getMovements(
      id,
      query.limit!,
      query.page!,
    );
    return { success: true, data, message: 'Portfolio movements retrieved' };
  }
}
