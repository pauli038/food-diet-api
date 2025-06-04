import { Body, Controller, Get, Param, Put, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Profile')
@Controller('profiles')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  
  @Get('user/:userId')
  @ApiParam({ name: 'userId', type: Number, description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Perfil encontrado con datos del usuario asociado' })
  async getByUserId(@Param('userId') userId: number) {
    return this.profileService.findByUserId(userId);
  }


  @Put('user/:id')
  @ApiBody({ type: UpdateProfileDto })
  updateProfileByUserId(
    @Param('id') id: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profileService.updateByUserId(Number(id), dto);
  }

 

 
}
