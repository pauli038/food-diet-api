import { PartialType } from '@nestjs/mapped-types';
import { CreateRecipeForeignDto } from './create-recipe.dto';


export class UpdateRecipeForeignDto extends PartialType(CreateRecipeForeignDto) {}
