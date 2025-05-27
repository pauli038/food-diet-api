import { Body, Controller, Get, Param, Put, Request } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('Profile')
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  
  @Get('user/:id')
  getProfileByUserId(@Param('id') id: string) {
    return this.profileService.findByUserId(Number(id));
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
