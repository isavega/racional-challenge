import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { TransactionsService } from './transactions.service.js';
import { CreateDepositDto } from './dto/create-deposit.dto.js';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto.js';

@ApiTags('Transactions')
@ApiSecurity('api-key')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('deposit')
  @ApiOperation({ summary: 'Create a deposit transaction' })
  @ApiResponse({ status: 201, description: 'Deposit created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Invalid or missing API key' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createDeposit(@Body() dto: CreateDepositDto) {
    const data = await this.transactionsService.createDeposit(dto);
    return { success: true, data, message: 'Deposit created successfully' };
  }

  @Post('withdrawal')
  @ApiOperation({ summary: 'Create a withdrawal transaction' })
  @ApiResponse({ status: 201, description: 'Withdrawal created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Invalid or missing API key' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createWithdrawal(@Body() dto: CreateWithdrawalDto) {
    const data = await this.transactionsService.createWithdrawal(dto);
    return { success: true, data, message: 'Withdrawal created successfully' };
  }
}
