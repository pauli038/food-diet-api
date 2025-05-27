import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateRecipeDto } from './create-recipe.dto';

export class CreateRecipeListDto {
  @ApiProperty({ type: [CreateRecipeDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateRecipeDto)
  recipes: CreateRecipeDto[];
}
