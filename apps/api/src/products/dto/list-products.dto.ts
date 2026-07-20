import { IsOptional, IsUUID } from "class-validator";

export class ListProductsQueryDto {
  @IsOptional()
  @IsUUID()
  categoryId?: string;
}
