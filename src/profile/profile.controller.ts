import { Body, Controller, Get, Param, Put, Request } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('Profile')
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // Obtener perfil por ID de usuario (temporal para desarrollo)
  @Get('user/:id')
  getProfileByUserId(@Param('id') id: string) {
    return this.profileService.findByUserId(Number(id));
  }

  // Actualizar perfil por ID de usuario (sin autenticación)
  @Put('user/:id')
  @ApiBody({ type: UpdateProfileDto })
  updateProfileByUserId(
    @Param('id') id: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profileService.updateByUserId(Number(id), dto);
  }

  // Buscar perfil por email del usuario (útil en algunos casos)
  @Get('email/:email')
  getProfileByEmail(@Param('email') email: string) {
    return this.profileService.getByEmail(email);
  }

 
}
