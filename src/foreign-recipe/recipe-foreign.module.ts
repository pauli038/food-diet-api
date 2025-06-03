
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RecipeForeign } from './recipe-foreign.model';
import { RecipeForeignService } from './recipe-foreign.service';
import { RecipeForeignController } from './recipe-foreign.controller';
import { GeminiModule } from '../gemini/gemini.module';
import { Profile } from 'src/profile/profile.model';
import { User } from 'src/user/user.model';

@Module({
  imports: [SequelizeModule.forFeature([RecipeForeign, Profile,User]), GeminiModule],
  controllers: [RecipeForeignController],
  providers: [RecipeForeignService],
})
export class RecipeForeignModule {}
