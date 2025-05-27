import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "src/user/user.model";

@Table
export class Profile extends Model {
  @Column(DataType.INTEGER) age: number;
  @Column(DataType.FLOAT) height: number;
  @Column(DataType.FLOAT) weight: number;
  @Column(DataType.STRING) objective: string;
  @Column(DataType.JSON)
  preferences: string[]; 

  @Column(DataType.JSON)
  conditions: { condition: string; notes: string }[]; 

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
