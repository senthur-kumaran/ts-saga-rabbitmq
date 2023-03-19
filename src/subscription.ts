import { BrokerAsPromised } from "rascal";
import { processOrder } from "./order";
import { processPayment } from "./payment";

const subscriptions = async (rascalBroker: BrokerAsPromised) => {
    // Create a subscription for processing orders using Rascal
    try {
        const subscription = await rascalBroker.subscribe('order_processing_sub');

        subscription.on('message', async (msg: any, content: any, ackOrNack: any) => {
            try {
                await processOrder(msg, rascalBroker);
                ackOrNack();
            } catch (err) {
                console.error(err);
                ackOrNack(err);
            }
        });
        subscription.on('error', (err: any) => {
            console.error(err);
            process.exit(1);
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }

    // Create a subscription for processing payments using Rascal
    try {
        const subscription = await rascalBroker.subscribe('payment_processing');
        subscription.on('message', async (msg: any, content: any, ackOrNack: any) => {
            try {
                await processPayment(msg);
                ackOrNack();
            } catch (err) {
                console.error(err);
                ackOrNack(err);
            }
        });
        subscription.on('error', (err: any) => {
            console.error(err);
            process.exit(1);
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

export default subscriptions;