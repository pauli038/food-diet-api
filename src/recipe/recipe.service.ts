import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Recipe } from './recipe.model';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { buildRecipePrompt } from 'src/utils/prompt-builder';
import axios from 'axios';
import { Profile } from 'src/profile/profile.model';


@Injectable()
export class RecipeService {
  Profile: any;
  apiKey: any;
  user: any;
  constructor(
    @InjectModel(Recipe)
    private recipeModel: typeof Recipe,
  ) {}

   async saveGeneratedRecipes(recipes: CreateRecipeDto[]) {
    const savedRecipes: Recipe[] = [];

    for (const r of recipes) {
      const recipe = await this.recipeModel.create({
        name: r.name,
        description: r.description,
        ingredients: JSON.stringify(r.ingredients),
        steps: JSON.stringify(r.steps),
      });

      savedRecipes.push(recipe);
    }

    return savedRecipes;
  }

 async generateRecipeFromGemini(email: string): Promise<Recipe> {
  const user = await this.user.findOne({ where: { email }, include: [Profile] });

  if (!user || !user.profile) {
    throw new NotFoundException('Usuario o perfil no encontrado');
  }

  const prompt = buildRecipePrompt(user.profile);

  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`,
    {
      contents: [{ parts: [{ text: prompt }] }],
    }
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


  async getAllRecipes(): Promise<Recipe[]> {
    return this.recipeModel.findAll();
  }


}
