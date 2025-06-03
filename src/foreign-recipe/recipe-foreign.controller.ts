import { Controller, Post, Get, Param, Body, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { RecipeForeignService } from './recipe-foreign.service';
import { UpdateRecipeForeignDto } from './dto/update-recipe-foreign.dto';
import { CreateRecipeForeignDto } from './dto/create-recipe.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('foreign-recipes')
@Controller('foreign-recipes')
export class RecipeForeignController {
  constructor(private readonly service: RecipeForeignService) {}

  @Post()
  create(@Body() dto: CreateRecipeForeignDto) {
    return this.service.create(dto);
  }

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

@Get()
  @ApiOperation({ summary: 'Obtener todas las recetas extranjeras' })
  findAll() {
    return this.service.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Obtener recetas por ID de usuario' })
  getByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.service.findByUserId(userId);
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRecipeForeignDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}
