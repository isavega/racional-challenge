import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service.js';
import { Timestamp } from 'firebase-admin/firestore';
import { Collections } from '../common/constants/collections.js';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly firebaseService: FirebaseService) {}

  async seed() {
    if (process.env.NODE_ENV === 'production') {
      throw new ForbiddenException('Seeding is not allowed in production');
    }

    try {
      const db = this.firebaseService.getFirestore();

      await this.clearCollections(db);

      const users = [
        {
          name: 'Catalina Fernández Muñoz',
          email: 'catalina.fernandez@gmail.com',
          rut: '12.345.678-9',
          phone: '+56912345678',
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        },
        {
          name: 'Sebastián Araya López',
          email: 'sebastian.araya@gmail.com',
          rut: '17.654.321-K',
          phone: '+56987654321',
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        },
      ];

      const batch = db.batch();

      const userRefs: string[] = [];
      for (const user of users) {
        const ref = db.collection(Collections.USERS).doc();
        batch.set(ref, user);
        userRefs.push(ref.id);
      }

      const portfolioRefs: string[] = [];
      for (let i = 0; i < userRefs.length; i++) {
        const ref = db.collection(Collections.PORTFOLIOS).doc();
        batch.set(ref, {
          userId: userRefs[i],
          name: i === 0 ? 'Portafolio Principal' : 'Portafolio de Inversiones',
          currency: 'CLP',
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
        portfolioRefs.push(ref.id);
      }

      const transactionTemplates = [
        { type: 'DEPOSIT', amount: 5000000, dayOffset: -30, notes: 'Initial deposit' },
        { type: 'DEPOSIT', amount: 2000000, dayOffset: -25, notes: 'Monthly contribution' },
        { type: 'WITHDRAWAL', amount: 500000, dayOffset: -20, notes: 'Emergency fund withdrawal' },
        { type: 'DEPOSIT', amount: 1500000, dayOffset: -15, notes: 'Bonus deposit' },
        { type: 'WITHDRAWAL', amount: 300000, dayOffset: -10, notes: 'Partial withdrawal' },
      ];

      let transactionCount = 0;
      for (let i = 0; i < portfolioRefs.length; i++) {
        for (const template of transactionTemplates) {
          const ref = db.collection(Collections.TRANSACTIONS).doc();
          const date = new Date();
          date.setDate(date.getDate() + template.dayOffset);

          batch.set(ref, {
            portfolioId: portfolioRefs[i],
            userId: userRefs[i],
            type: template.type,
            amount: template.amount,
            date: Timestamp.fromDate(date),
            notes: template.notes,
            createdAt: Timestamp.now(),
          });
          transactionCount++;
        }
      }

      const orderTemplates = [
        { ticker: 'AAPL', type: 'BUY', quantity: 10, price: 175.50, dayOffset: -28, status: 'EXECUTED' },
        { ticker: 'MSFT', type: 'BUY', quantity: 5, price: 420.80, dayOffset: -22, status: 'EXECUTED' },
        { ticker: 'AMZN', type: 'BUY', quantity: 3, price: 185.25, dayOffset: -18, status: 'EXECUTED' },
        { ticker: 'BCI.SN', type: 'BUY', quantity: 50, price: 28500, dayOffset: -12, status: 'PENDING' },
        { ticker: 'FALABELLA.SN', type: 'SELL', quantity: 20, price: 2850, dayOffset: -8, status: 'EXECUTED' },
        { ticker: 'AAPL', type: 'SELL', quantity: 5, price: 180.25, dayOffset: -5, status: 'CANCELLED' },
      ];

      let orderCount = 0;
      for (let i = 0; i < portfolioRefs.length; i++) {
        for (const template of orderTemplates) {
          const ref = db.collection(Collections.ORDERS).doc();
          const date = new Date();
          date.setDate(date.getDate() + template.dayOffset);

          batch.set(ref, {
            portfolioId: portfolioRefs[i],
            userId: userRefs[i],
            ticker: template.ticker,
            type: template.type,
            quantity: template.quantity,
            price: template.price,
            status: template.status,
            date: Timestamp.fromDate(date),
            createdAt: Timestamp.now(),
          });
          orderCount++;
        }
      }

      await batch.commit();

      return {
        users: userRefs.length,
        portfolios: portfolioRefs.length,
        transactions: transactionCount,
        orders: orderCount,
        userIds: userRefs,
        portfolioIds: portfolioRefs,
      };
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;
      this.logger.error('Failed to seed data', (error as Error).stack);
      throw new InternalServerErrorException('Failed to seed data');
    }
  }

  private async clearCollections(db: FirebaseFirestore.Firestore) {
    const collectionNames = [
      Collections.USERS,
      Collections.PORTFOLIOS,
      Collections.TRANSACTIONS,
      Collections.ORDERS,
    ];

    for (const name of collectionNames) {
      const snapshot = await db.collection(name).get();
      if (snapshot.empty) continue;

      const batch = db.batch();
      snapshot.docs.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
    }
  }
}
