import express from 'express';
import bodyParser from 'body-parser';
import { v4 as uuid } from 'uuid';
import { BrokerAsPromised } from 'rascal';
import { getBrokerConnection } from './rascal.config';
import { Order, Payment } from './type';
import { processPayment } from './payment';
import subscriptions from './subscription';

// init message queue broker
let rascalBroker: BrokerAsPromised | any;

(async () => {
    rascalBroker = await getBrokerConnection();
    await subscriptions(rascalBroker);
})();

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Define a route for creating orders
app.post('/orders', async (req, res) => {
    const order: Order = req.body;

    // Generate a unique ID for the order
    const orderId = uuid();

    // Publish a message to the "order" queue
    try {
        await rascalBroker.publish('order_processing_pub', Buffer.from(JSON.stringify({ ...order, id: orderId })));
        console.log(`Processing order ${orderId}`);
        res.status(201).json({ id: orderId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Start the Express app
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
