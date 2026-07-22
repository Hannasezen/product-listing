import { Module } from "@nestjs/common";
import { DbModule } from "@org/db";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { HealthController } from "./health.controller";
import { ProductsModule } from "../products/products.module";
import { CategoriesModule } from "../categories/categories.module";
import { FavoritesModule } from "../favorites/favorites.module";

@Module({
  imports: [DbModule, ProductsModule, CategoriesModule, FavoritesModule],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
