import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingsService } from './bookings.service';

@ApiTags('Bookings')
@ApiBearerAuth()
@Controller()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create booking (PENDING)' })
  @ApiBody({ type: CreateBookingDto })
  @ApiResponse({ status: 201 })
  @ApiResponse({ status: 400 })
  @ApiResponse({ status: 403 })
  @ApiResponse({ status: 401 })
  create(@Body() dto: CreateBookingDto, @Headers('x-user-id') userId?: string) {
    if (!userId) {
      throw new UnauthorizedException('Missing x-user-id');
    }

    return this.bookingsService.create(dto, userId);
  }

  @Get('showtime/:id/occupied')
  getOccupiedSeats(@Param('id') showtimeId: string) {
    return this.bookingsService.getOccupiedSeats(showtimeId);
  }
}
