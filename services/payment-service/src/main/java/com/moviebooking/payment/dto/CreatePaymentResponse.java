package com.moviebooking.payment.dto;

import java.util.UUID;

public class CreatePaymentResponse {

    private UUID paymentId;
    private String status;

    public CreatePaymentResponse(UUID paymentId, String status) {
        this.paymentId = paymentId;
        this.status = status;
    }

	public UUID getPaymentId() {
		return paymentId;
	}

	public void setPaymentId(UUID paymentId) {
		this.paymentId = paymentId;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

    
}
