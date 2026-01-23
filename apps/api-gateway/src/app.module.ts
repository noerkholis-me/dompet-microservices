import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GatewaySecurityMiddleware } from './middleware/gateway-security.middleware';
import { AuthMiddleware } from './middleware/auth-middleware';
import { RbacMiddleware } from './middleware/rbac-middleware';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './auth/auth.controller';
import { HttpModule } from '@nestjs/axios';
import { UsersController } from './users/users.controller';
import { ProductsController } from './products/products.controller';
import { TransactionsController } from './transactions/transactions.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [AppController, AuthController, ProductsController, UsersController, TransactionsController],
  providers: [AppService, JwtService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 1. Security header (wajib pertama untuk semua route)
    consumer.apply(GatewaySecurityMiddleware).forRoutes('*');

    // 2. Auth middleware (skip login & refresh)
    consumer
      .apply(AuthMiddleware)
      .exclude({ path: 'api/login', method: RequestMethod.POST })
      .exclude({ path: 'api/refresh-token', method: RequestMethod.POST })
      .forRoutes('*');

    // 3. RBAC middleware (apply ke route yang butuh role check)
    consumer.apply(RbacMiddleware).forRoutes(
      'api/users',
      'api/products', // ADMIN full, PEMBELI read-only ditangani di RBAC logic
      'api/transactions/pay', // contoh ADMIN bisa pay
    );
  }
}
