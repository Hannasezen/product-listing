import { Module } from '@nestjs/common';
import { DbModule } from '@org/db';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health.controller';
import { ProductsModule } from '../products/products.module';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [DbModule, ProductsModule, CategoriesModule],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
