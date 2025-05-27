import { ApiProperty } from "@nestjs/swagger";

export class UpdateProfileDto {
  @ApiProperty() age: number;
  @ApiProperty() height: number;
  @ApiProperty() weight: number;
  @ApiProperty() objective: string;
  @ApiProperty({ type: [String] }) preferences: string[];
  @ApiProperty({ type: [Object] }) conditions: { condition: string; notes: string }[];
}
