import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional()
  email?: string;
  @ApiPropertyOptional()
  password?: string;
  @ApiPropertyOptional()
  age?: number;

  @ApiPropertyOptional()
  height?: number;

  @ApiPropertyOptional()
  weight?: number;

  @ApiPropertyOptional()
  objective?: string;

  @ApiPropertyOptional({ type: [String] })
  preferences?: string[];

  @ApiPropertyOptional({ type: [Object] })
  conditions?: { condition: string; notes: string }[];
}

