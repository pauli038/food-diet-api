import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { CreateRecipeListDto } from './dto/create-recipe-list.dto';
import { ApiTags, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('Recipe')
@Controller('recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

@Post('manual')
  @ApiBody({ type: CreateRecipeListDto })
  async createManualRecipes(@Body() body: CreateRecipeListDto) {
    return this.recipeService.saveGeneratedRecipes(body.recipes);
  }
@Post('generate/email/:email')
@ApiParam({ name: 'email', type: String })
async generateFromEmail(@Param('email') email: string) {
  return this.recipeService.generateRecipeFromGemini(email);
}

  @Get()
  async getAllRecipes() {
    return this.recipeService.getAllRecipes();
  }
}
