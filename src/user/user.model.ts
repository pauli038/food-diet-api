import { Column, DataType, HasOne, Model, Table } from "sequelize-typescript";
import { Profile } from "src/profile/profile.model";

@Table
export class User extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
   declare email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare password: string;

  @HasOne(() => Profile)
  declare profile: Profile;
}
