export class CreateRecipeForeignDto {
  name: string;
  description: string;
  ingredients: string[];
  steps: string[];
  country?: string;
  imageUrl?: string;
  category?: string;
  originType?: string;
  userId: number; 
}
