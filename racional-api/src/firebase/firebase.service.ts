import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);
  private db: admin.firestore.Firestore;

  onModuleInit() {
    const base64 = process.env.FIREBASE_SERVICE_ACCOUNT;

    if (base64) {
      try {
        const serviceAccount = JSON.parse(
          Buffer.from(base64, 'base64').toString('utf-8'),
        );
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
        this.logger.log('Firebase initialized with service account credential');
      } catch (error) {
        this.logger.error(
          'Failed to parse FIREBASE_SERVICE_ACCOUNT. Ensure it is valid base64-encoded JSON.',
          (error as Error).message,
        );
        throw error;
      }
    } else {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
      this.logger.warn(
        'Firebase initialized with application default credentials (development fallback)',
      );
    }

    this.db = admin.firestore();
  }

  getFirestore(): admin.firestore.Firestore {
    return this.db;
  }
}
