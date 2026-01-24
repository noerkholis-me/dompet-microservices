import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GatewaySecurityMiddleware } from './middleware/gateway-security.middleware';
import { AuthMiddleware } from './middleware/auth-middleware';
import { RbacMiddleware } from './middleware/rbac-middleware';
import { JwtService } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { TransactionsModule } from './transactions/transactions.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
      global: true,
    }),
    AuthModule,
    ProductsModule,
    TransactionsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GatewaySecurityMiddleware).forRoutes('*');
    consumer
      .apply(AuthMiddleware)
      .exclude({ path: 'api/login', method: RequestMethod.POST })
      .exclude({ path: 'api/refresh-token', method: RequestMethod.POST })
      .forRoutes('*');
    consumer.apply(RbacMiddleware).forRoutes('api/users', 'api/products', 'api/transactions/pay');
  }
}
