package com.moviebooking.payment.event;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public class PaymentEvent {

    private UUID eventId;
    private String eventType;
    private UUID bookingId;
    private UUID paymentId;
    private BigDecimal amount;
    private OffsetDateTime occurredAt;

    public PaymentEvent(
            String eventType,
            UUID bookingId,
            UUID paymentId,
            BigDecimal amount
    ) {
        this.eventId = UUID.randomUUID();
        this.eventType = eventType;
        this.bookingId = bookingId;
        this.paymentId = paymentId;
        this.amount = amount;
        this.occurredAt = OffsetDateTime.now();
    }

	public UUID getEventId() {
		return eventId;
	}

	public void setEventId(UUID eventId) {
		this.eventId = eventId;
	}

	public String getEventType() {
		return eventType;
	}

	public void setEventType(String eventType) {
		this.eventType = eventType;
	}

	public UUID getBookingId() {
		return bookingId;
	}

	public void setBookingId(UUID bookingId) {
		this.bookingId = bookingId;
	}

	public UUID getPaymentId() {
		return paymentId;
	}

	public void setPaymentId(UUID paymentId) {
		this.paymentId = paymentId;
	}

	public BigDecimal getAmount() {
		return amount;
	}

	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}

	public OffsetDateTime getOccurredAt() {
		return occurredAt;
	}

	public void setOccurredAt(OffsetDateTime occurredAt) {
		this.occurredAt = occurredAt;
	}

    // getters
    
    
}
