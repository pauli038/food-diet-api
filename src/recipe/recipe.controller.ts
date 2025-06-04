import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Put, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { Recipe } from './recipe.model';
import { AuthGuard } from '@nestjs/passport';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { User } from 'src/auth/user.decorator';

@ApiTags('Recipe')
@Controller('recipes')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

 @Post()
async createRecipe(
  @Body() dto: CreateRecipeDto,
  @User() user: any,
  ) {
  return this.recipeService.createRecipeManually(user.id, dto);
  }

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
@Get()
async getAll(): Promise<Recipe[]> {
  return this.recipeService.getAllRecipes();
}

  @Patch(':id')
  async updateRecipe(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRecipeDto,
    @User() user: any,
  ) {
    
    console.log(user);
    
    return this.recipeService.updateRecipeById(id, user.id, dto);
  }

  @Delete(':id')
  async deleteRecipe(
  @Param('id', ParseIntPipe) id: number,
  @User() user: any,
  ) {
  return this.recipeService.deleteRecipeById(id, user.id);
  }


  

}
