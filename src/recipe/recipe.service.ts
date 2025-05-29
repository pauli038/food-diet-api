import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Recipe } from './recipe.model';
import { Profile } from '../profile/profile.model';
import { User } from '../user/user.model';
import { GeminiService } from 'src/gemini/gemini.service';
import { buildRecipePrompt } from 'src/utils/prompt-builder';


@Injectable()
export class RecipeService {
  constructor(
    @InjectModel(Recipe) private recipeModel: typeof Recipe,
    @InjectModel(Profile) private profileModel: typeof Profile,
    @InjectModel(User) private userModel: typeof User,
    private readonly geminiService: GeminiService,
  ) {}

  async generateFromUserId(userId: number) {
    const profile = await this.profileModel.findOne({ where: { userId } });

    if (!profile) {
      throw new NotFoundException('Perfil no encontrado');
    }

    const prompt = this.buildRecipePrompt(profile);
    const aiText = await this.geminiService.generateContent(prompt);
     const cleaned = aiText
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    try {
      const recipeData = JSON.parse(cleaned);
      return await this.recipeModel.create({
        title: recipeData.nombre || 'Receta generada',
        content: JSON.stringify(recipeData),
        userId,
      });
    } catch (error) {
      console.error('❌ Error al hacer JSON.parse:', error.message);
      throw new BadRequestException('No se pudo parsear la receta generada por IA');
    }
  }
  
 async findByUserId(userId: number) {
  const recipes = await this.recipeModel.findAll({ where: { userId } });

  return recipes.map(recipe => ({
    id: recipe.id,
    userId: recipe.userId,
    name: recipe.name,
    description: recipe.description,
    ingredients: recipe.ingredients ? JSON.parse(recipe.ingredients) : [],
    steps: recipe.steps ? JSON.parse(recipe.steps) : [],
    createdAt: recipe.createdAt,
    updatedAt: recipe.updatedAt,
  }));
}


  
  private buildRecipePrompt(profile: Profile): string {
      const age = profile.age ? profile.age : "no especificada";
  const weight = profile.weight ? profile.weight : "no especificado";
  const height = profile.height ? profile.height : "no especificada";
  const objective = profile.objective || "ninguno";
  const preferences = Array.isArray(profile.preferences)
    ? (profile.preferences.length ? profile.preferences.join(", ") : "ninguna preferencia")
    : (typeof profile.preferences === 'string' && (profile.preferences as string).length ? profile.preferences : "ninguna preferencia");
  const conditions = Array.isArray(profile.conditions) && profile.conditions.length
    ? profile.conditions.map((c: any) => c.condition).join(", ")
    : (typeof profile.conditions === 'string' && (profile.conditions as string).length
        ? profile.conditions
        : "ninguna condición");

  return `
Genera una receta saludable considerando lo siguiente:
- Edad: ${age}
- Peso: ${weight}
- Altura: ${height}
- Objetivo: ${objective}
- Preferencias alimenticias: ${preferences}
- Condiciones médicas: ${conditions}

La receta debe ser práctica, con ingredientes accesibles, indicar nombre, descripción, porciones, pasos e información nutricional.
Devuélvela en formato JSON válido con las siguientes propiedades: nombre, descripcion, porciones, ingredientes[], instrucciones[], informacion_nutricional_aproximada_por_porcion.
`;
}


  async findAll() {
    return this.recipeModel.findAll();
  }
}
