import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Max, Min } from 'sequelize-typescript';

export class CreateProfileDto {

  @ApiProperty() userId: number;
  @ApiPropertyOptional() email?: string;
  @ApiPropertyOptional() password?: string;
  @ApiProperty() age: number;
  @ApiProperty() @Min(30) @Max(300) height: number;
  @ApiProperty() @Min(10) @Max(500)  weight: number;
  @ApiProperty() objective: string;
  @ApiProperty({ type: [String] }) preferences: string[];
  @ApiProperty({ type: [Object] }) conditions: { condition: string; notes: string }[];
}
