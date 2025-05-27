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

  async updateByEmail(email: string, dto: UpdateProfileDto): Promise<Profile> {
    const user = await this.userModel.findOne({
      where: { email },
      include: [Profile],
    });

    if (!user || !user.profile) {
      throw new NotFoundException('Perfil no encontrado');
    }

    const profile = user.profile;

    profile.age = dto.age;
    profile.height = dto.height;
    profile.weight = dto.weight;
    profile.objective = dto.objective;
    preferences: dto.preferences;
    conditions: dto.conditions;

    await profile.save();
    return profile;
  }
}