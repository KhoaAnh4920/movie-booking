import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateShowtimeDto {
  @ApiProperty({
    description: 'Movie Version ID (IMAX, 2D, Director Cut, ...)',
  })
  @IsString()
  @IsNotEmpty()
  movieVersionId!: string;

  @ApiProperty({ example: '2026-01-15T18:00:00Z' })
  @IsDateString()
  startTime!: string;

  @ApiProperty({ example: '2026-01-15T20:30:00Z' })
  @IsDateString()
  endTime!: string;

  @ApiProperty({
    example: { standard: 120000, vip: 180000 },
  })
  @IsObject()
  priceConfig!: Record<string, number>;
}
