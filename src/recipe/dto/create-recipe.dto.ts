import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateRecipeDto {
  @ApiProperty({ example: 'Ensalada de Quinoa' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Una ensalada fresca y nutritiva.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ type: [String], example: ['Quinoa', 'Tomate', 'Aguacate'] })
  @IsArray()
  @IsNotEmpty()
  ingredients: string[];

  @ApiProperty({ type: [String], example: ['Cocer la quinoa', 'Mezclar con los ingredientes'] })
  @IsArray()
  @IsNotEmpty()
  steps: string[];
}
