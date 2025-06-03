import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import { User } from 'src/user/user.model';

@Table({ timestamps: true })
export class Recipe extends Model {
  
  @Column({ type: DataType.STRING })
  name: string;

  @Column({ type: DataType.STRING })
  description: string;

  @Column({ type: DataType.TEXT })
  ingredients: string;

  @Column({ type: DataType.TEXT })
  steps: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;
}
