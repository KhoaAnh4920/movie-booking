export enum PaymentStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export class PaymentEvent {
  paymentId!: string;
  bookingId!: string;
  amount!: number;
  status!: PaymentStatus;
  occurredAt!: string;
}

export class CreatePaymentRequest {
  bookingId!: string;
  amount!: number;
  method!: 'MOCK' | 'CARD' | 'MOMO';
}
