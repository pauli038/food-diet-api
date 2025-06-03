import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';



export class RegisterDto {
  @ApiProperty() @IsEmail() email: string;
  @ApiProperty() password: string;
  @ApiProperty() age: number;
  @ApiProperty() height: number;
  @ApiProperty() weight: number;
  @ApiProperty() objective: string;
  @ApiProperty({ type: [Object] }) 
  conditions: { condition: string; notes: string }[];
  @ApiProperty({ type: [String] }) preferences: string[];

  

}
