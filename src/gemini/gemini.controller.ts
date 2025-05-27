import { Controller, Post, Param } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { ApiTags, ApiParam } from '@nestjs/swagger';
import { Recipe } from '../recipe/recipe.model';

@ApiTags('Gemini')
@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('generate/:userId')
  @ApiParam({ name: 'userId', required: true, type: Number })
  async generate(@Param('userId') userId: number): Promise<Recipe> {
    return this.geminiService.generateFromUser(userId);
  }
}
