// profile.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Profile } from './profile.model';
import { ProfileService } from './profile.service';
import { User } from 'src/user/user.model';
import { ProfileController } from './profile.controller';

@Module({
  imports: [SequelizeModule.forFeature([Profile, User])],
   controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService], 
})
export class ProfileModule {}
