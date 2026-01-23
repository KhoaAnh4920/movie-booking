package com.moviebooking.payment.dto;

import java.math.BigDecimal;
import java.util.UUID;

public class CreatePaymentRequest {

    private UUID bookingId;
    private BigDecimal amount;
    private String method; // MOCK, MOMO, CARD
    
    
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
	public String getMethod() {
		return method;
	}
	public void setMethod(String method) {
		this.method = method;
	}

    
}
