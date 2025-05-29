import { Controller, Get, Param, Post } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Recipe')
@Controller('recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Post('generate/user/:userId')
  @ApiParam({ name: 'userId', description: 'ID del usuario', type: Number })
  async generateForUser(@Param('userId') userId: number) {
    return this.recipeService.generateFromUserId(userId);
  }
  
  @Get('user/:userId')
async getRecipesByUser(@Param('userId') userId: number) {
  return this.recipeService.findByUserId(userId);
}

}
