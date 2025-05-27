import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { User } from "src/user/user.model";
import { ProfileService } from "src/profile/profile.service";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login.dto";
import { RecoverPasswordDto } from "./dto/recover-password.dto";
import { InjectModel } from "@nestjs/sequelize";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

constructor(
 @InjectModel(User) private userModel: typeof User,
  private readonly profile: ProfileService, 
  private readonly jwtService: JwtService,
) {}

async register(dto: RegisterDto) {
  const hashedPassword = await bcrypt.hash(dto.password, 10);

  const user = await this.userModel.create({
    email: dto.email,
    password: hashedPassword,
  });
  console.log('hashedPassword:', hashedPassword);


  await this.profile.createProfile({
    userId: user.id,
    age: dto.age,
    height: dto.height,
    weight: dto.weight,
    objective: dto.objective,
    preferences: dto.preferences,
    conditions: dto.conditions,
  });

  return user;
}

async login(dto: LoginDto) {
  const user = await this.userModel.findOne({ where: { email: dto.email } });

  console.log('DTO Password:', dto.password);
  console.log('User Password:', user?.password);

  if (!user || !(await bcrypt.compare(dto.password, user.password))) {
    throw new UnauthorizedException('Credenciales inválidas');
  }

  const payload = { email: user.email, sub: user.id };

  return {
    access_token: this.jwtService.sign(payload),
  };
}

async recoverPassword(dto: RecoverPasswordDto) {
  const user = await this.userModel.findOne({ where: { email: dto.email } });

  if (!user) {
    throw new NotFoundException('Usuario no encontrado');
  }

  user.password = dto.newPassword;
  await user.save();

  return { message: 'Contraseña actualizada correctamente' };
}

}