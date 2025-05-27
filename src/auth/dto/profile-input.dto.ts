import { ApiProperty } from '@nestjs/swagger';



export class ProfileInputDto {
  @ApiProperty() age: number;
  @ApiProperty() height: number;
  @ApiProperty() weight: number;
  @ApiProperty() objective: string;

  @ApiProperty({ type: [String] })
  preferences: string[];

  @ApiProperty({ type: [String] })
  conditions: string[];
}
