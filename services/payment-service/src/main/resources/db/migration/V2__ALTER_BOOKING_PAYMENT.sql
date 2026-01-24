ALTER TABLE payments
ADD CONSTRAINT uq_payment_booking UNIQUE (booking_id);
