import { IsArray, IsString } from 'class-validator';

export class CreateRecipeForeignDto {
  @IsString() name: string;
  @IsString() country: string;
  @IsString() description: string;
  @IsString() imageUrl: string;
  @IsArray() ingredients: string[];
  @IsArray() steps: string[];
  @IsString() category: string;
  @IsString() originType: string;
}