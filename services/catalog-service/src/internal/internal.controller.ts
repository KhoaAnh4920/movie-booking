import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { InternalGuard } from '../common/guards/internal.guard';
import { ShowtimesService } from '../showtimes/showtimes.service';
import { QuoteSeatDto } from 'src/showtimes/dto/quote-seat.dto';

@UseGuards(InternalGuard)
@Controller('internal')
export class InternalController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  @Post('showtimes/:id/seats/quote')
  quoteSeats(@Param('id') showtimeId: string, @Body() dto: QuoteSeatDto) {
    return this.showtimesService.quoteSeats(showtimeId, dto.seatIds);
  }
}
