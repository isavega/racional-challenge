import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseService } from '../../firebase/firebase.service.js';
import { Collections } from '../constants/collections.js';

@Injectable()
export class ValidationService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async validatePortfolioAndUser(portfolioId: string, userId: string) {
    const db = this.firebaseService.getFirestore();

    const [portfolioDoc, userDoc] = await Promise.all([
      db.collection(Collections.PORTFOLIOS).doc(portfolioId).get(),
      db.collection(Collections.USERS).doc(userId).get(),
    ]);

    if (!portfolioDoc.exists) {
      throw new NotFoundException(`Portfolio with id "${portfolioId}" not found`);
    }
    if (!userDoc.exists) {
      throw new NotFoundException(`User with id "${userId}" not found`);
    }
  }
}
