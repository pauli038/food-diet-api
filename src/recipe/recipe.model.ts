import { Column, Model, Table, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { User } from 'src/user/user.model';

@Table
export class Recipe extends Model {
  @Column(DataType.STRING)
  name: string;

  @Column(DataType.TEXT)
  description: string;

  @Column(DataType.JSON)
  ingredients: any[];

 @Column(DataType.JSON)
 steps: any[];
  
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;
  
  @BelongsTo(() => User)
  user: User;
}
