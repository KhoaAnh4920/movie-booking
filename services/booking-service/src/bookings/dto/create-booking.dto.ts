import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  showtimeId!: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  seatIds!: string[];
}
