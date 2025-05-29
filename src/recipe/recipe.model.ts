import { Column, Model, Table, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { User } from 'src/user/user.model';

@Table
export class Recipe extends Model {
  @Column(DataType.STRING)
  name: string;

  @Column(DataType.TEXT)
  description: string;

  @Column(DataType.TEXT)
  ingredients: string; 

  @Column(DataType.TEXT)
  steps: string; 
  
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;
  
  @BelongsTo(() => User)
  user: User;
}
