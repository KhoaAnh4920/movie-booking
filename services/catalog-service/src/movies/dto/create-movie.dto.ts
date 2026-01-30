import { ApiProperty } from '@nestjs/swagger';
import { MovieStatus } from '@prisma/client';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class CreateMovieDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ required: false })
  @IsString()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  image!: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  rating!: number;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  genres!: string[];

  @ApiProperty()
  @IsInt()
  @Min(0)
  durationMinutes!: number;

  @ApiProperty()
  @IsDateString()
  releaseDate!: string;

  @ApiProperty({ enum: MovieStatus })
  @IsEnum(MovieStatus)
  status!: MovieStatus;
}
