import { IsArray } from 'class-validator';

export class QuoteSeatDto {
  @IsArray()
  seatIds!: string[];
}
