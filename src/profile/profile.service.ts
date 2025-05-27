import { Injectable, NotFoundException } from "@nestjs/common";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { Profile } from "./profile.model";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "src/user/user.model";
import { CreateProfileDto } from "./dto/create-profile.dto";

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile) private profileModel: typeof Profile,
    @InjectModel(User) private userModel: typeof User,
  ) {}

  async createProfile(dto: CreateProfileDto): Promise<Profile> {
  return this.profileModel.create({
    userId: dto.userId,
    age: dto.age,
    height: dto.height,
    weight: dto.weight,
    objective: dto.objective,
    preferences: JSON.stringify(dto.preferences),
    conditions: JSON.stringify(dto.conditions),
  });
}
async findByUserId(userId: number) {
  return this.profileModel.findOne({ where: { userId } });
}


  async getByEmail(email: string): Promise<Profile> {
    const user = await this.userModel.findOne({
      where: { email },
      include: [Profile],
    });

    if (!user || !user.profile) {
      throw new NotFoundException('Perfil no encontrado');
    }

    return user.profile;
  }

  
  async updateByUserId(userId: number, dto: UpdateProfileDto): Promise<Profile> {
    const profile = await this.profileModel.findOne({ where: { userId } });

    if (!profile) {
      throw new NotFoundException('Perfil no encontrado');
    }

    
    if (dto.preferences) {
      dto.preferences = JSON.stringify(dto.preferences) as any;
    }

    if (dto.conditions) {
      dto.conditions = JSON.stringify(dto.conditions) as any;
    }

    return profile.update(dto);
  }
}