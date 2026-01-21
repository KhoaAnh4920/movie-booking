import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

interface QuoteSeatResponse {
  showtimeId: string;
  totalAmount: number;
  seats: {
    seatId: string;
    row: string;
    number: number;
    type: string;
    price: number;
  }[];
}

@Injectable()
export class CatalogClient {
  private readonly baseUrl: string;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    this.baseUrl = this.config.get<string>('CATALOG_SERVICE_BASE_URL')!;
  }

  async quoteSeats(showtimeId: string, seatIds: string[]) {
    const response = await firstValueFrom(
      this.http.post<QuoteSeatResponse>(
        `${this.baseUrl}/internal/showtimes/${showtimeId}/seats/quote`,
        { seatIds },
        {
          headers: {
            'x-internal-call': 'booking-service',
          },
        },
      ),
    );

    return response.data;
  }
}
