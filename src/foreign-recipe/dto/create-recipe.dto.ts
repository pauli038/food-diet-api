
import { ApiProperty } from '@nestjs/swagger';

export class CreateRecipeForeignDto {
  @ApiProperty({ example: 'Ensalada de Quinoa' })
  name: string;

  @ApiProperty({ example: 'Una ensalada fresca y nutritiva.' })
  description: string;

  @ApiProperty({ example: ['Quinoa', 'Tomate', 'Aguacate'] })
  ingredients: string[];

  @ApiProperty({ example: ['Cocer la quinoa', 'Mezclar con los ingredientes'] })
  steps: string[];

  @ApiProperty({ example: 'https://example.com/image.jpg', required: false })
  imageUrl?: string;

  @ApiProperty({ example: 'Ensaladas', required: false })
  category?: string;

  @ApiProperty({ example: 'Tradicional', required: false })
  originType?: string;

  @ApiProperty({ example: 'Perú', required: false })
  country?: string;

}
