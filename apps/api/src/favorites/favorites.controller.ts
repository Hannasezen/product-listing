import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  Req,
  UseGuards,
} from "@nestjs/common";
import type { Request } from "express";
import { SessionGuard } from "@org/auth";
import { FavoritesService } from "./favorites.service.js";
import { AddFavoriteDto } from "./dto/add-favorite.dto.js";

@Controller("favorites")
@UseGuards(SessionGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  findAll(@Req() req: Request) {
    return this.favoritesService.findAllForUser(req.user!.id);
  }

  @Post()
  add(@Req() req: Request, @Body() dto: AddFavoriteDto) {
    return this.favoritesService.add(req.user!.id, dto.productId);
  }

  @Delete(":productId")
  remove(
    @Req() req: Request,
    @Param("productId", ParseUUIDPipe) productId: string,
  ) {
    return this.favoritesService.remove(req.user!.id, productId);
  }
}
