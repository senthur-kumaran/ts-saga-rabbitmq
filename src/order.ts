import { v4 as uuid } from 'uuid';

import { Payment } from './type';
import { BrokerAsPromised } from 'rascal';

// Define a worker function for processing orders
export async function processOrder(msg: any, rascalBroker: BrokerAsPromised) {
    const order = JSON.parse(msg.content.toString());
    const orderId = order.id;

    // Simulate order processing time
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log(`Processed order ${orderId}`);

    // Publish a message to the "payment" queue
    try {
        const payment: Payment = {
            orderId,
            amount: order.total
        };

        // Generate a unique ID for the payment
        const paymentId = uuid();

        await rascalBroker.publish('payment_processing', Buffer.from(JSON.stringify({ ...payment, id: paymentId })));
        console.log(`Processing payment ${paymentId}`);
    } catch (error) {
        console.error(error);
    }
}