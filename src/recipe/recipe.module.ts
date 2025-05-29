import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Recipe } from './recipe.model';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { Profile } from '../profile/profile.model';
import { GeminiModule } from '../gemini/gemini.module';
import { User } from 'src/user/user.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Recipe, Profile,User]),
    GeminiModule, 
  ],
  providers: [RecipeService],
  controllers: [RecipeController],
})
export class RecipeModule {}
