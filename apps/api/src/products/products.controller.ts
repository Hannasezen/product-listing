import { Controller, Get, Param, ParseUUIDPipe, Query } from "@nestjs/common";
import { ProductsService } from "./products.service.js";
import { ListProductsQueryDto } from "./dto/list-products.dto.js";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Query() query: ListProductsQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get("slug/:slug")
  findBySlug(@Param("slug") slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }
}
