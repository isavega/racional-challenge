import { Global, Module } from '@nestjs/common';
import { ValidationService } from './services/validation.service.js';

@Global()
@Module({
  providers: [ValidationService],
  exports: [ValidationService],
})
export class CommonModule {}
