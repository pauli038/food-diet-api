import { Controller, Post, Get, Param, Body, Patch, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { RecipeForeignService } from './recipe-foreign.service';
import { UpdateRecipeForeignDto } from './dto/update-recipe-foreign.dto';
import { CreateRecipeForeignDto } from './dto/create-recipe.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.decorator';


@ApiTags('foreign-recipes')
@Controller('foreign-recipes')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
export class RecipeForeignController {
  constructor(private readonly service: RecipeForeignService) {}
 
  
  @Post('generate/:userId')
  @ApiOperation({ summary: 'Generar una receta extranjera con Gemini a partir del perfil del usuario' })
  @ApiParam({ name: 'userId', type: Number, description: 'ID del usuario con perfil configurado' })
  @ApiResponse({ status: 201, description: 'Receta generada con éxito' })
  async generateFromUser(@Param('userId', ParseIntPipe) userId: number) {
    const recipe = await this.service.generateFromUserId(userId);
    return {
      message: 'Receta generada correctamente con Gemini',
      data: recipe,
    };
  }


  @Get('user/:userId')
  async getByUser(@Param('userId', ParseIntPipe) userId: number) {
  const recipes = await this.service.findByUserId(userId);

  return recipes.map((recipe) => ({
    id: recipe.id,
    name: recipe.name,
    country: recipe.country,
    description: recipe.description,
    imageUrl: recipe.imageUrl,
    category: recipe.category,
    originType: recipe.originType,
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
    userId: recipe.userId,
    createdAt: recipe.createdAt,
    updatedAt: recipe.updatedAt,
  }));
}

 @Get()
  getAll() {
    return this.service.findAll();
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Post()
 async createRecipe(
   @Body() dto: CreateRecipeForeignDto,
   @User() user: any,
   ) {
   return this.service.createRecipeManually(user.id, dto);
   }
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRecipeForeignDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}
