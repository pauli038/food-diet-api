import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RecipeForeign } from './recipe-foreign.model';
import { UpdateRecipeForeignDto } from './dto/update-recipe-foreign.dto';
import { GeminiService } from '../gemini/gemini.service';
import { CreateRecipeForeignDto } from './dto/create-recipe.dto';
import { buildForeignRecipePrompt } from 'src/utils/prompt-builder-foreign';
import { Profile } from 'src/profile/profile.model';
import { User } from 'src/user/user.model';


@Injectable()
export class RecipeForeignService {
  constructor(
    @InjectModel(RecipeForeign) private recipeModel: typeof RecipeForeign,
      @InjectModel(Profile) private profileModel: typeof Profile,
        @InjectModel(User) private userModel: typeof User,
    private geminiService: GeminiService
  ) {}

 async create(dto: CreateRecipeForeignDto) {
  const plainData = { ...dto };
  return this.recipeModel.create(plainData);
}

  async generateFromUserId(userId: number) {
    const profile = await this.profileModel.findOne({ where: { userId } });
    if (!profile) throw new NotFoundException('Perfil no encontrado');

    const prompt = buildForeignRecipePrompt(profile);
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
      throw new BadRequestException('No se pudo parsear la receta generada por IA');
    }

    if (!recipeData.name || !recipeData.description || !Array.isArray(recipeData.ingredients) || !Array.isArray(recipeData.steps)) {
      console.error('📛 Datos inválidos:', recipeData);
      throw new BadRequestException('La receta generada no contiene los campos requeridos.');
    }

    const recipe = await this.recipeModel.create({
      name: recipeData.name,
      description: String(recipeData.description),
      ingredients: recipeData.ingredients,
      steps: recipeData.steps,
      country: recipeData.country || 'Sin país',
      imageUrl: recipeData.imageUrl || '',
      category: recipeData.category || 'sin categoría',
      originType: 'generado',
    });

    return recipe;
  }

  async findAll() {
    return this.recipeModel.findAll();
  }

  async findByUserId(userId: number) {
    return this.recipeModel.findAll({ where: { userId } });
  }

  async findById(id: number) {
    const recipe = await this.recipeModel.findByPk(id);
    if (!recipe) throw new NotFoundException('Receta no encontrada');
    return recipe;
  }

  async update(id: number, dto: UpdateRecipeForeignDto) {
    const recipe = await this.findById(id);
    return recipe.update(dto);
  }

  async delete(id: number) {
    const recipe = await this.findById(id);
    return recipe.destroy();
  }
}