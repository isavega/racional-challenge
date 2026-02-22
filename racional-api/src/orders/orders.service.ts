import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service.js';
import { ValidationService } from '../common/services/validation.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { Timestamp } from 'firebase-admin/firestore';
import { Collections } from '../common/constants/collections.js';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly validationService: ValidationService,
  ) {}

  async create(dto: CreateOrderDto) {
    try {
      const db = this.firebaseService.getFirestore();

      await this.validationService.validatePortfolioAndUser(dto.portfolioId, dto.userId);

      const docRef = db.collection(Collections.ORDERS).doc();

      const data = {
        portfolioId: dto.portfolioId,
        userId: dto.userId,
        ticker: dto.ticker,
        type: dto.type,
        quantity: dto.quantity,
        price: dto.price,
        status: 'PENDING' as const,
        date: Timestamp.fromDate(new Date(dto.date)),
        createdAt: Timestamp.now(),
      };

      await docRef.set(data);
      return { id: docRef.id, ...data };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error('Failed to create order', (error as Error).stack);
      throw new InternalServerErrorException('Failed to create order');
    }
  }
}
