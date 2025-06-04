
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RecoverPasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  newPassword: string;

  @IsString()
  @MinLength(8)
  confirmPassword: string;
}
