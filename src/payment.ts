// Define a worker function for processing payments
export async function processPayment(msg: any) {
    const payment = JSON.parse(msg.content.toString());
    const paymentId = payment.id;

    // Simulate payment processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log(`Processed payment ${paymentId}`);
}