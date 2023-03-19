import * as rascal from 'rascal';

const config: rascal.BrokerConfig = {
  vhosts: {
    '/': {
      connection: {
        hostname: 'localhost',
        port: 5672,
        user: 'guest',
        password: 'guest',
      },
      exchanges: ['app'],
      queues: ['order', 'payment'],
      bindings: [
        'app[order_processing] -> order',
        'app[payment_processing] -> payment',
      ],
      "publications": {
        "order_processing_pub": {
          "exchange": "app",
          "routingKey": "order_processing"
        },
        "payment_processing": {
          "exchange": "app",
          "routingKey": "payment_processing"
        }
      },
      "subscriptions": {
        "order_processing_sub": {
          "queue": "order"
        },
        "payment_processing": {
          "queue": "payment"
        }
      }
    },
  },
};

export const getBrokerConnection = async () => {
    try {
      const broker = await rascal.BrokerAsPromised.create(config);
      broker.on('error', console.error);
      console.log('Connected to Rascal');
      return broker;
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  };
