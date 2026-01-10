import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { MovieStatus } from '@prisma/client';

export class CreateMovieDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ required: false })
  @IsString()
  description?: string;

  @ApiProperty({ example: 120 })
  @IsInt()
  durationMinutes!: number;

  @ApiProperty()
  @IsDateString()
  releaseDate!: string;
  @ApiProperty({ enum: MovieStatus })
  @IsEnum(MovieStatus)
  status!: MovieStatus;
}
