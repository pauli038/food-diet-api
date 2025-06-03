
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class RecipeForeign extends Model {
  @Column({ type: DataType.STRING })
  name: string;

  @Column({ type: DataType.STRING })
  country: string;

  @Column({ type: DataType.STRING })
  description: string;

  @Column({ type: DataType.STRING })
  imageUrl: string;

  @Column({ type: DataType.JSON })
  ingredients: string[];

  @Column({ type: DataType.JSON })
  steps: string[];

  @Column({ type: DataType.STRING })
  category: string; 

  @Column({ type: DataType.STRING })
  originType: string; 
}