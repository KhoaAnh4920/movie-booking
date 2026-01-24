package com.moviebooking.payment.service;

import com.moviebooking.payment.domain.Payment;
import com.moviebooking.payment.dto.CreatePaymentRequest;
import com.moviebooking.payment.event.PaymentEvent;
import com.moviebooking.payment.event.PaymentEventPublisher;
import com.moviebooking.payment.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Random;

@Service
public class PaymentService {

    private final PaymentRepository repository;
    private final Random random = new Random();
    private final PaymentEventPublisher publisher;

    public PaymentService(PaymentRepository repository, PaymentEventPublisher publisher) {
        this.repository = repository;
        this.publisher = publisher;
    }

    public Payment process(CreatePaymentRequest request) {
    	
    	Optional<Payment> existing =
                repository.findByBookingId(request.getBookingId());
    	
    	if (existing.isPresent()) {
            return existing.get(); 
        }

        Payment payment = new Payment();
        payment.setBookingId(request.getBookingId());
        payment.setAmount(request.getAmount());
        payment.setMethod(request.getMethod());
        payment.setStatus("PENDING");

        payment = repository.save(payment);

        boolean success = random.nextBoolean();
        payment.setStatus(success ? "SUCCESS" : "FAILED");

        payment = repository.save(payment);
        
        PaymentEvent event = new PaymentEvent(
                payment.getId(),
                payment.getBookingId(),
                payment.getAmount(),
                success ? "SUCCESS" : "FAILED"
        );

        publisher.publish(
                success ? "payment.succeeded" : "payment.failed",
                event
        );
        
        return payment;
    }
}
