import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import axios from 'axios';
import { Recipe } from '../recipe/recipe.model';
import { Profile } from '../profile/profile.model';
import { buildRecipePrompt } from '../utils/prompt-builder';

@Injectable()
export class GeminiService {
  constructor(
    @InjectModel(Recipe) private recipeModel: typeof Recipe,
    @InjectModel(Profile) private profileModel: typeof Profile,
  ) {
    if (!process.env.GEMINI_API_KEY) {
      throw new InternalServerErrorException('API key de Gemini no configurada');
    }
    this.apiKey = process.env.GEMINI_API_KEY;
  }

  private apiKey: string;

  async generateFromUser(userId: number): Promise<Recipe> {
    const profile = await this.profileModel.findOne({ where: { userId } });

    if (!profile) {
      throw new NotFoundException('Perfil de usuario no encontrado');
    }

    const prompt = buildRecipePrompt(profile);

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
    );

    const text = response.data.candidates[0]?.content?.parts[0]?.text;

    const parsed = JSON.parse(text);

    return this.recipeModel.create({
      name: parsed.name,
      description: parsed.description,
      ingredients: JSON.stringify(parsed.ingredients),
      steps: JSON.stringify(parsed.steps),
    });
  }
}
