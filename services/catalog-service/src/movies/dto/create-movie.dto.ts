import { ApiProperty } from '@nestjs/swagger';
import { MovieStatus } from '@prisma/client';
import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateMovieDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ required: false })
  @IsString()
  description?: string;

  @ApiProperty()
  @IsDateString()
  releaseDate!: string;

  @ApiProperty({ enum: MovieStatus })
  @IsEnum(MovieStatus)
  status!: MovieStatus;
}
