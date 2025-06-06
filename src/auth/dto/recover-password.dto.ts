
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RecoverPasswordDto {
  @ApiProperty({ example: 'usuario@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'NuevaContraseña123' })
  @IsString()
  @MinLength(8)
  newPassword: string;

  @ApiProperty({ example: 'NuevaContraseña123' })
  @IsString()
  @MinLength(8)
  confirmPassword: string;
}

