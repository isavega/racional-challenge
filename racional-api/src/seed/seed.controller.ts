import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SeedService } from './seed.service.js';
import { Public } from '../common/decorators/public.decorator.js';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Seed database with test data (non-production only)' })
  @ApiResponse({ status: 201, description: 'Database seeded successfully' })
  @ApiResponse({ status: 403, description: 'Seeding not allowed in production' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async seed() {
    const data = await this.seedService.seed();
    return { success: true, data, message: 'Database seeded successfully' };
  }
}
