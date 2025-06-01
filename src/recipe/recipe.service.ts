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

@Injectable()
export class RecipeService {
  constructor(
    @InjectModel(Recipe) private recipeModel: typeof Recipe,
    @InjectModel(Profile) private profileModel: typeof Profile,
    @InjectModel(User) private userModel: typeof User,
    private readonly geminiService: GeminiService,
  ) {}

   private safeJsonParse(value: any): any[] {
    if (!value) return [];
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  }
  
  async createWithCurrentUser(dto: CreateRecipeDto, userId: number) {
    if (!Array.isArray(dto.ingredients) || !Array.isArray(dto.steps)) {
      throw new BadRequestException('Los ingredientes y pasos deben ser arrays');
    }

    return await this.recipeModel.create({
      ...dto,
      ingredients: JSON.stringify(dto.ingredients),
      steps: JSON.stringify(dto.steps),
      userId,
    });
  }

 
  async generateFromUserId(userId: number) {
    const profile = await this.profileModel.findOne({ where: { userId } });

    if (!profile) {
      throw new NotFoundException('Perfil no encontrado');
    }

    const prompt = buildRecipePrompt(profile);
    const aiText = await this.geminiService.generateContent(prompt);

    const cleaned = aiText
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    let recipeData: any;

    try {
      recipeData = JSON.parse(cleaned);
    } catch (error) {
      console.error('❌ Error al hacer JSON.parse:', error.message);
      console.log('Contenido fallido:', cleaned);
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


  async findAll() {
    return this.recipeModel.findAll();
  }
  async deletebyUserId(id: number) {
    const recipe = await this.recipeModel.findByPk(id);
    if (!recipe) {
      throw new NotFoundException('Receta no encontrada');
    }
    await recipe.destroy();
    return { message: 'Receta eliminada correctamente' };
 
  }
  

}