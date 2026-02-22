import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service.js';
import { ValidationService } from '../common/services/validation.service.js';
import { CreateDepositDto } from './dto/create-deposit.dto.js';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto.js';
import { Timestamp } from 'firebase-admin/firestore';
import { Collections } from '../common/constants/collections.js';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly validationService: ValidationService,
  ) {}

  async createDeposit(dto: CreateDepositDto) {
    return this.createTransaction(dto, 'DEPOSIT');
  }

  async createWithdrawal(dto: CreateWithdrawalDto) {
    return this.createTransaction(dto, 'WITHDRAWAL');
  }

  private async createTransaction(
    dto: CreateDepositDto | CreateWithdrawalDto,
    type: 'DEPOSIT' | 'WITHDRAWAL',
  ) {
    try {
      const db = this.firebaseService.getFirestore();

      await this.validationService.validatePortfolioAndUser(dto.portfolioId, dto.userId);

      const docRef = db.collection(Collections.TRANSACTIONS).doc();

      const data = {
        portfolioId: dto.portfolioId,
        userId: dto.userId,
        type,
        amount: dto.amount,
        date: Timestamp.fromDate(new Date(dto.date)),
        notes: dto.notes ?? null,
        createdAt: Timestamp.now(),
      };

      await docRef.set(data);
      return { id: docRef.id, ...data };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to create ${type.toLowerCase()}`, (error as Error).stack);
      throw new InternalServerErrorException(`Failed to create ${type.toLowerCase()}`);
    }
  }
}
