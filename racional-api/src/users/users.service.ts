import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { FieldValue } from 'firebase-admin/firestore';
import { Collections } from '../common/constants/collections.js';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly firebaseService: FirebaseService) {}

  async update(id: string, dto: UpdateUserDto) {
    try {
      const db = this.firebaseService.getFirestore();
      const docRef = db.collection(Collections.USERS).doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new NotFoundException(`User with id "${id}" not found`);
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
      this.logger.error(`Failed to update user ${id}`, (error as Error).stack);
      throw new InternalServerErrorException('Failed to update user');
    }
  }
}
