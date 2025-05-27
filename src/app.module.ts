import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { ProfileModule } from './profile/profile.module';
import { User } from './user/user.model';
import { Profile } from './profile/profile.model';
import { Recipe } from './recipe/recipe.model';
import { RecipeModule } from './recipe/recipe.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

@Module({
  
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRoot({
       dialect: process.env.DB_DIALECT as any,
       host: process.env.DB_HOST,
       port:(process.env.DB_PORT, 3306),
       username: process.env.DB_USERNAME,
       password: process.env.DB_PASSWORD,
       database: process.env.DB_NAME,
       models: [User, Profile, Recipe],
       autoLoadModels: true,
       synchronize: true,
       logging: false,
    }),
    UserModule,
    ProfileModule,
    RecipeModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule {}
