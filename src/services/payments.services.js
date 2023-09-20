import Stripe from 'stripe';

export default class PaymentsService {
    constructor() {
        this.stripe = new Stripe('sk_test_51NsZAUJPsB84nJYMRlmbNVXkxM2EW29R316YPmeA6ID7rfV9oDjXGAez2qKCSBcGuBKaJ0Wn9EtrVKUVy6MAXhym00PcrnBZnG');
    }

    paymentsProductsService = async (ticket) => {
        const paymentIntentInfo = {
            amount: ticket.amount,
            currency: 'usd'
        };
        const paymentIntent = this.stripe.paymentIntents.create(paymentIntentInfo);
        return paymentIntent;
    }
}