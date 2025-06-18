import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { User } from 'src/user/user.model';
import { ProfileService } from 'src/profile/profile.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import {
  RecoverPasswordDto,
  resetPaswordDto,
} from './dto/recover-password.dto';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { EmailHelperService } from 'src/email-helper/email-helper.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    private readonly profile: ProfileService,
    private readonly jwtService: JwtService,
    private readonly emailHelperService: EmailHelperService,
  ) {}

  async register(dto: RegisterDto) {
    const prevUser = await this.userModel.findOne({
      where: { email: dto.email },
    });

    console.log(prevUser);
    if (prevUser) {
      throw new ConflictException(`El correo ya se encuentra en uso.`);
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.userModel.create({
      email: dto.email,
      password: hashedPassword,
    });

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

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { email: user.email, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
      userId: user.id,
    };
  }

  async recoverPassword(dto: RecoverPasswordDto) {
    const { email } = dto;

    const user = await this.userModel.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }


    const newTemporalPassword = crypto.randomBytes(4).toString('hex');
    const hashedTempPassword = await bcrypt.hash(newTemporalPassword, 10);

    user.temporalPassword = hashedTempPassword;
    const expires= new Date(Date.now() + 15 * 60 * 1000);
    user.temporalPasswordExpires = expires
    await user.save();

    await this.emailHelperService.sendTemporalPass(
      user.email,
      newTemporalPassword,
    );

    return { message: 'Intrucciones enviadas al correo.' };
  }

  async resetPassword(dto: resetPaswordDto) {
    const { newPassword, temporalPassword, email } = dto;

    const user = await this.userModel.findOne({ where: { email } });

    if (!user || !user.temporalPassword) {
      throw new NotFoundException(
        'Usuario no encontrado o sin contraseña temporal',
      );
    }
    if (
      !user.temporalPasswordExpires ||
      user.temporalPasswordExpires < new Date()
    ) {
      throw new BadRequestException('La contraseña temporal ha expirado');
    }

    const isTempMatch = await bcrypt.compare(
      temporalPassword,
      user.temporalPassword,
    );
    if (!isTempMatch) {
      throw new BadRequestException('Código temporal incorrecto');
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new BadRequestException(
        'La nueva contraseña no puede ser igual a la anterior',
      );
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.temporalPassword = null;
    user.temporalPasswordExpires = null;
    await user.save();

    return { message: 'Contraseña modificada con exito.' };
  }

  extractTokenFromRawHeaders(rawHeaders: string[]): string | null {
    for (let i = 0; i < rawHeaders.length; i += 2) {
      if (rawHeaders[i].toLowerCase() === 'authorization') {
        const tokenHeader = rawHeaders[i + 1];
        if (tokenHeader && tokenHeader.startsWith('Bearer ')) {
          return tokenHeader.replace('Bearer ', '');
        }
      }
    }
    return null;
  }

  async decodeToken(rawHeaders: string[]) {
    const token = this.extractTokenFromRawHeaders(rawHeaders);

    if (!token) {
      throw new UnauthorizedException('No token found in raw headers');
    }

    try {
      const decoded = await this.jwtService.decode(token);

      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
