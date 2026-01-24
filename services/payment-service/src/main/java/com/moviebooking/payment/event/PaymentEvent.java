package com.moviebooking.payment.event;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public class PaymentEvent {

    private UUID paymentId;
    private UUID bookingId;
    private BigDecimal amount;
    private String status;
    private OffsetDateTime occurredAt;

    public PaymentEvent(
            UUID paymentId,
            UUID bookingId,
            BigDecimal amount,
            String status
    ) {
        this.paymentId = paymentId;
        this.bookingId = bookingId;
        this.amount = amount;
        this.status = status;
        this.occurredAt = OffsetDateTime.now();
    }

    public UUID getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(UUID paymentId) {
        this.paymentId = paymentId;
    }

    public UUID getBookingId() {
        return bookingId;
    }

    public void setBookingId(UUID bookingId) {
        this.bookingId = bookingId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public OffsetDateTime getOccurredAt() {
        return occurredAt;
    }

    public void setOccurredAt(OffsetDateTime occurredAt) {
        this.occurredAt = occurredAt;
    }
}
