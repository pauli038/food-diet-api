import { Module } from '@nestjs/common';
import { EmailHelperService } from './email-helper.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/user/user.model';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  providers: [EmailHelperService],
  exports:[EmailHelperService]
})
export class EmailHelperModule {}
