# probit-node

Work in progress. <3

```javascript
const Probit = require('./Probit.js');

let probit = new Probit("ID", "SECRET", false);
    probit.socket.on('ready', () => {
        // Connected and authenticated, start doing stuff. 
        probit.socket.subscribe("BTC-USDT");
    })
    probit.socket.on('balance', (balance) => {
        /*
        {   
            BTC: {  
                available: '0.1503423100003594', 
                total: '0.1513443100003594' 
            },
            CORN: { 
                available: '13371337', 
                total: '13371337' 
            },
        }
        */
    })
    probit.socket.on('ticker', (ticker) => {
         /*
        {   symbol: 'BTC-USDT',
            lag: 0,
            last: 10256.5,
            low: 8602,
            high: 10320.8,
            change: 519.6,
            baseVolume: 529.01369008,
            quoteVolume: 5301659.809196408,
            timestamp: '2020-02-12T03:47:51.000Z'
        }
        */
    })
    probit.socket.on('trade', (trade) => {
        /*
        {   symbol: 'BTC-USDT',
            lag: 0,
            id: 'BTC-USDT:3179196',
            quantity: 0.482626,
            side: 'buy',
            tickDirection: 'up',
            timestamp: '2020-02-12T03:49:02.177Z' 
        }
        */
    })
    probit.socket.on('order', (order) => {
        /*
        {   id: 344833732,
            userId: 'c8a24c28-94c5-40ff-9f70-4750fge721d8',
            type: 'limit',
            side: 'buy',
            quantity: 1000,
            price: 0.000001,
            timeInForce: 'gtc',
            filledCost: 0,
            filledQuantity: 0,
            openQuantity: 1000,
            cancelledQuantity: 0,
            status: 'open',
            timestamp: '2020-02-11T04:04:54.103Z',
            clientOrderId: ''
        }
        */
    })
    probit.socket.on('orderbook', (order) => {
        /* 
        {   symbol: 'BTC-USDT',
            lag: 0,
            side: 'buy',
            price: 10241.4,
            quantity: 0.035501
        }
        */
    })
    probit.socket.on('orderbookL0', (order) => {
        /*
        {   symbol: 'BTC-USDT',
            lag: 0,
            side: 'sell',
            price: 10290,
            quantity: 0.021851 
        }
        */
    })
    probit.socket.on('orderbookL1', (order) => {
        /*
        {   symbol: 'BTC-USDT',
            lag: 0,
            side: 'buy',
            price: 10267,
            quantity: 0.469602
        }
        */
    })
    probit.socket.on('orderbookL2', (order) => {
        /*
        {   symbol: 'BTC-USDT',
            lag: 0,
            side: 'buy',
            price: 10260,
            quantity: 2.746949 
        }
        */
    })
    probit.socket.on('orderbookL3', (order) => {
        /*
        {   symbol: 'BTC-USDT',
            lag: 0,
            side: 'buy',
            price: 10200,
            quantity: 9.881496 
        }
        */
    })
    probit.socket.on('orderbookL4', (order) => {
        /*
        {   symbol: 'BTC-USDT',
            lag: 0,
            side: 'buy',
            price: 8000,
            quantity: 0.000494
        }
        */
    })
    probit.socket.on('tradehistory', (history) => {
        /*
        {   id: 'PROB-BTC:98965',
            orderId: 344813807,
            side: 'buy',
            feeAmount: 1.3612558524528322,
            feeCurrencyId: 'PROB',
            status: 'settled',
            price: 0.00001089,
            quantity: 759.11258769,
            cost: 0.0082667360799441,
            time: '2020-02-11T03:36:37.462Z',
            market_id: 'PROB-BTC'
        }
        */
    })

    probit.rest.on('ready', () => {
        // Authenticated and ready to do stuff.
    });
```