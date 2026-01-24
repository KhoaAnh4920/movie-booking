import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { CreatePaymentRequest } from './payment-event.dto';

@Injectable()
export class PaymentClient {
  private readonly baseUrl: string;

  constructor(
    private readonly http: HttpService,
    config: ConfigService,
  ) {
    this.baseUrl = config.get<string>('PAYMENT_SERVICE_BASE_URL')!;
  }

  async createPayment(request: CreatePaymentRequest) {
    await firstValueFrom(this.http.post(`${this.baseUrl}/payments`, request));
  }
}
