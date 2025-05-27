import { Column, Model, Table, DataType } from 'sequelize-typescript';

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
}
