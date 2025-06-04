import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Recipe } from './recipe.model';
import { Profile } from '../profile/profile.model';
import { User } from '../user/user.model';
import { GeminiService } from 'src/gemini/gemini.service';
import { buildRecipePrompt } from 'src/utils/prompt-builder';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';



@Injectable()
export class RecipeService {
  constructor(
    @InjectModel(Recipe) private recipeModel: typeof Recipe,
    @InjectModel(Profile) private profileModel: typeof Profile,
    @InjectModel(User) private userModel: typeof User,
    private readonly geminiService: GeminiService
  ) {}

   private safeJsonParse(value: any): any[] {
    if (!value) return [];
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  }
  async createRecipeManually(
  userId: number,
  dto: CreateRecipeDto,
): Promise<{ message: string; recipeId: number }> {
  try {
    const recipe = await this.recipeModel.create({
      userId,
      name: dto.name,
      description: dto.description,
      ingredients: JSON.stringify(dto.ingredients),
      steps: JSON.stringify(dto.steps),
    });

    return {
      message: 'Receta creada correctamente',
      recipeId: recipe.id,
    };
  } catch (error) {
    console.error('Error al crear la receta:', error);
    throw new InternalServerErrorException('Error al crear la receta');
  }
}

  async generateFromUserId(userId: number) {
  const profile = await this.profileModel.findOne({ where: { userId } });

  if (!profile) {
    throw new NotFoundException('Perfil no encontrado');
  }

  const prompt = buildRecipePrompt(profile);
  const aiText = await this.geminiService.generateContent(prompt);


  const start = aiText.indexOf('{');
  const end = aiText.lastIndexOf('}');

  if (start === -1 || end === -1) {
    console.error('🛑 No se encontró un bloque JSON válido');
    console.error('Contenido completo:', aiText);
    throw new BadRequestException('No se encontró un bloque JSON válido');
  }

  const jsonString = aiText.substring(start, end + 1).trim();

  let recipeData: any;

  try {
    recipeData = JSON.parse(jsonString);
  } catch (error) {
    console.error('❌ Error al hacer JSON.parse:', error.message);
    console.log('Contenido fallido:', jsonString);
    throw new BadRequestException(
      'No se pudo parsear la receta generada por IA',
    );
  }

  if (
    !recipeData.name ||
    !recipeData.description ||
    !Array.isArray(recipeData.ingredients) ||
    !Array.isArray(recipeData.steps)
  ) {
    console.error('📛 Datos inválidos:', recipeData);
    throw new BadRequestException(
      'La receta generada no contiene los campos requeridos.',
    );
  }

  const recipe = await this.recipeModel.create({
    name: recipeData.name,
    description: String(recipeData.description),
    ingredients: JSON.stringify(recipeData.ingredients),
    steps: JSON.stringify(recipeData.steps),
    userId,
  });

  return recipe;
}

  async findByUserId(userId: number): Promise<Recipe[]> {
    const recipes = await this.recipeModel.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });

    return recipes.map((recipe) => {
      const data = recipe.toJSON();
      return {
        ...data,
        ingredients: this.safeJsonParse(data.ingredients),
        steps: this.safeJsonParse(data.steps),
      };
    });
  }


  async getAllRecipes(): Promise<Recipe[]> {
  try {
    return await this.recipeModel.findAll({
      order: [['createdAt', 'DESC']],
    });
  } catch (error) {
    throw new InternalServerErrorException(
      (error as Error).message || 'Error al obtener las recetas',
    );
  }
}
async updateRecipeById(
  recipeId: number,
  userId: number,
  dto: UpdateRecipeDto,
): Promise<{ message: string }> {
  const recipe = await this.recipeModel.findOne({ where: { id: recipeId, userId } });

  if (!recipe) {
    throw new NotFoundException('Receta no encontrada o no autorizada');
  }

  const updateData: any = {};
  if (dto.name !== undefined) updateData.name = dto.name;
  if (dto.description !== undefined) updateData.description = dto.description;
  if (dto.ingredients !== undefined) updateData.ingredients = JSON.stringify(dto.ingredients);
  if (dto.steps !== undefined) updateData.steps = JSON.stringify(dto.steps);

  try {
    const [updatedCount] = await this.recipeModel.update(updateData, {
      where: { id: recipeId, userId }
    });

    if (updatedCount === 0) {
      throw new InternalServerErrorException('La receta no se pudo actualizar');
    }

  } catch (error) {
    console.error('Error al guardar la receta:', error);
    throw new InternalServerErrorException('Error al guardar la receta');
  }

  return { message: 'Receta actualizada correctamente' };
}

async deleteRecipeById(recipeId: number, userId: number): Promise<{ message: string }> {
  const recipe = await this.recipeModel.findOne({ where: { id: recipeId, userId } });

  if (!recipe) {
    throw new NotFoundException('Receta no encontrada o no autorizada');
  }

  try {
    await recipe.destroy(); // También podrías usar `await this.recipeModel.destroy({ where: { id: recipeId, userId } })`
  } catch (error) {
    console.error('Error al eliminar la receta:', error);
    throw new InternalServerErrorException('Error al eliminar la receta');
  }

  return { message: 'Receta eliminada correctamente' };
}




   
}