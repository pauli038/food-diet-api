import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Req } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { Recipe } from './recipe.model';

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
async getByUser(@Param('userId', ParseIntPipe) userId: number) {
  const recipes = await this.recipeService.findByUserId(userId);

  return recipes.map((recipe) => ({
    id: recipe.id,
    name: recipe.name,
    description: recipe.description,
    ingredients: typeof recipe.ingredients === 'string'
      ? JSON.parse(recipe.ingredients)
      : Array.isArray(recipe.ingredients)
        ? recipe.ingredients
        : [],
    steps: typeof recipe.steps === 'string'
      ? JSON.parse(recipe.steps)
      : Array.isArray(recipe.steps)
        ? recipe.steps
        : [],
    createdAt: recipe.createdAt,
    updatedAt: recipe.updatedAt,
  }));
}

  @Delete('user/:userId')
  @ApiParam({ name: 'userId', description: 'ID del usuario', type: Number })  
  async deleteByUser(@Param('userId', ParseIntPipe) userId: number) {
    const result = await this.recipeService.deletebyUserId(userId);
    if (!result) {
      throw new NotFoundException('No se encontraron recetas para eliminar de este usuario');
    }
    return { message: 'Recetas eliminadas correctamente' };
  }

}
