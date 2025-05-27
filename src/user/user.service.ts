import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./user.model";
import { Profile } from "src/profile/profile.model";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userModel: typeof User) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    return this.userModel.create({ ...dto });
  }

  async getAllUsers(): Promise<User[]> {
    return this.userModel.findAll({ include: [Profile] });
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({
      where: { email },
      include: [Profile],
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    return user;
  }
}