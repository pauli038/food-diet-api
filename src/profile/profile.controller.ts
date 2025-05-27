import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ProfileService } from "./profile.service";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { CreateProfileDto } from "./dto/create-profile.dto";

@ApiTags('Profiles')
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @ApiBody({ type: CreateProfileDto })
  async create(@Body() dto: CreateProfileDto) {
  return this.profileService.createProfile(dto);
  }
 
  @Get(':email')
  getByEmail(@Param('email') email: string) {
    return this.profileService.getByEmail(email);
  }

  @Put(':email')
  update(@Param('email') email: string, @Body() dto: UpdateProfileDto) {
    return this.profileService.updateByEmail(email, dto);
  }
}
