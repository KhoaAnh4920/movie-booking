package com.moviebooking.payment.controller;

import com.moviebooking.payment.domain.Payment;
import com.moviebooking.payment.dto.CreatePaymentRequest;
import com.moviebooking.payment.dto.CreatePaymentResponse;
import com.moviebooking.payment.service.PaymentService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    private final PaymentService service;

    public PaymentController(PaymentService service) {
        this.service = service;
    }

    @PostMapping
    public CreatePaymentResponse create(@RequestBody CreatePaymentRequest request) {
        Payment payment = service.process(request);
        return new CreatePaymentResponse(payment.getId(), payment.getStatus());
    }
}
