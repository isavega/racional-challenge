import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { FirebaseModule } from './firebase/firebase.module.js';
import { CommonModule } from './common/common.module.js';
import { UsersModule } from './users/users.module.js';
import { PortfoliosModule } from './portfolios/portfolios.module.js';
import { TransactionsModule } from './transactions/transactions.module.js';
import { OrdersModule } from './orders/orders.module.js';
import { SeedModule } from './seed/seed.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    FirebaseModule,
    CommonModule,
    UsersModule,
    PortfoliosModule,
    TransactionsModule,
    OrdersModule,
    SeedModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
