import { Injectable } from '@angular/core';
import { Stripe, loadStripe } from '@stripe/stripe-js';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  stripePromise: Promise<Stripe> | undefined;

  constructor() { 
    //this.stripePromise = loadStripe('your-publishable-key');
  }

  async createPaymentIntent(amount: number): Promise<any> {
    const stripe = await this.stripePromise;
    // Call your server to create a payment intent
    // Example: const response = await fetch('/create-payment-intent', { method: 'POST', body: JSON.stringify({ amount }) });
    // Example: return response.json();
  }

  async handleCardPayment(paymentMethodId: string, amount: number): Promise<any> {
    // Handle card payment using Stripe.js
  }


}
