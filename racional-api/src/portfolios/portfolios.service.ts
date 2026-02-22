import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service.js';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto.js';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { Collections } from '../common/constants/collections.js';

interface TransactionMovement {
  id: string;
  movementType: 'DEPOSIT' | 'WITHDRAWAL';
  portfolioId: string;
  userId: string;
  amount: number;
  date: Timestamp;
  notes: string | null;
  createdAt: Timestamp;
}

interface OrderMovement {
  id: string;
  movementType: 'BUY' | 'SELL';
  portfolioId: string;
  userId: string;
  ticker: string;
  quantity: number;
  price: number;
  status: string;
  date: Timestamp;
  createdAt: Timestamp;
}

export type Movement = TransactionMovement | OrderMovement;

@Injectable()
export class PortfoliosService {
  private readonly logger = new Logger(PortfoliosService.name);

  constructor(private readonly firebaseService: FirebaseService) {}

  async update(id: string, dto: UpdatePortfolioDto) {
    try {
      const db = this.firebaseService.getFirestore();
      const docRef = db.collection(Collections.PORTFOLIOS).doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new NotFoundException(`Portfolio with id "${id}" not found`);
      }

      const updateData = {
        ...dto,
        updatedAt: FieldValue.serverTimestamp(),
      };

      await docRef.update(updateData);

      const updated = await docRef.get();
      return { id: updated.id, ...updated.data() };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to update portfolio ${id}`, (error as Error).stack);
      throw new InternalServerErrorException('Failed to update portfolio');
    }
  }

  async getSummary(id: string) {
    try {
      const db = this.firebaseService.getFirestore();

      const portfolioDoc = await db.collection(Collections.PORTFOLIOS).doc(id).get();
      if (!portfolioDoc.exists) {
        throw new NotFoundException(`Portfolio with id "${id}" not found`);
      }

      const portfolioData = portfolioDoc.data()!;

      const [transactionsSnap, ordersSnap] = await Promise.all([
        db.collection(Collections.TRANSACTIONS).where('portfolioId', '==', id).get(),
        db.collection(Collections.ORDERS).where('portfolioId', '==', id).get(),
      ]);

      let cashBalance = 0;
      transactionsSnap.forEach((doc) => {
        const data = doc.data();
        if (data.type === 'DEPOSIT') {
          cashBalance += data.amount;
        } else if (data.type === 'WITHDRAWAL') {
          cashBalance -= data.amount;
        }
      });

      let stocksValue = 0;
      ordersSnap.forEach((doc) => {
        const data = doc.data();
        if (data.status !== 'EXECUTED') return;
        const value = data.quantity * data.price;
        if (data.type === 'BUY') {
          stocksValue += value;
        } else if (data.type === 'SELL') {
          stocksValue -= value;
        }
      });

      return {
        portfolioId: id,
        cashBalance,
        stocksValue,
        totalValue: cashBalance + stocksValue,
        currency: portfolioData.currency,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to get portfolio summary ${id}`, (error as Error).stack);
      throw new InternalServerErrorException('Failed to get portfolio summary');
    }
  }

  async getMovements(id: string, limit: number, page: number) {
    try {
      const db = this.firebaseService.getFirestore();

      const portfolioDoc = await db.collection(Collections.PORTFOLIOS).doc(id).get();
      if (!portfolioDoc.exists) {
        throw new NotFoundException(`Portfolio with id "${id}" not found`);
      }

      const [transactionsSnap, ordersSnap] = await Promise.all([
        db.collection(Collections.TRANSACTIONS).where('portfolioId', '==', id).get(),
        db.collection(Collections.ORDERS).where('portfolioId', '==', id).get(),
      ]);

      const movements: Movement[] = [];

      transactionsSnap.forEach((doc) => {
        const data = doc.data();
        movements.push({
          id: doc.id,
          movementType: data.type as 'DEPOSIT' | 'WITHDRAWAL',
          portfolioId: data.portfolioId,
          userId: data.userId,
          amount: data.amount,
          date: data.date,
          notes: data.notes,
          createdAt: data.createdAt,
        });
      });

      ordersSnap.forEach((doc) => {
        const data = doc.data();
        movements.push({
          id: doc.id,
          movementType: data.type as 'BUY' | 'SELL',
          portfolioId: data.portfolioId,
          userId: data.userId,
          ticker: data.ticker,
          quantity: data.quantity,
          price: data.price,
          status: data.status,
          date: data.date,
          createdAt: data.createdAt,
        });
      });

      movements.sort((a, b) => {
        const dateA = a.date instanceof Timestamp ? a.date.toMillis() : 0;
        const dateB = b.date instanceof Timestamp ? b.date.toMillis() : 0;
        return dateB - dateA;
      });

      const total = movements.length;
      const totalPages = Math.ceil(total / limit);
      const offset = (page - 1) * limit;
      const paginated = movements.slice(offset, offset + limit);

      return {
        items: paginated,
        total,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to get movements for portfolio ${id}`, (error as Error).stack);
      throw new InternalServerErrorException('Failed to get portfolio movements');
    }
  }
}
