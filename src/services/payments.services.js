import Stripe from 'stripe';

export default class PaymentsService {
    constructor() {
        this.stripe = new Stripe('sk_test_51NsbFgFfS7UCeYZIKxAUwtwNzMeV9i8KduP2tVzp8Qx7MKm94xGbWrBaubk4x13jcKzwhx4fc3X5uA04RIOFxgHg00QgyZPJlP');
    }

    paymentsProductsService = async (ticket) => {
        const paymentIntentInfo = {
            amount: ticket.amount,
            currency: 'usd'
        };
        const paymentIntent = this.stripe.paymentIntents.create(paymentIntentInfo)
        
        return paymentIntent;
    }
}