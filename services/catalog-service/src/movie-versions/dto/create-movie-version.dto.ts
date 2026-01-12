import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateMovieVersionDto {
  @ApiProperty({ example: 'IMAX' })
  @IsString()
  @IsNotEmpty()
  versionType!: string;

  @ApiProperty({ example: 150 })
  @IsInt()
  durationMinutes!: number;
}
