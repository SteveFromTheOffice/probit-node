# probit-node

Work in progress. <3

```javascript
const Probit = require('./Probit.js');

let probit = new Probit("ID", "SECRET", false);
    probit.on('ready', () => {
    })
    probit.on('balance', (balance) => {
    })
    probit.on('ticker', (ticker) => {
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
    probit.on('trade', (trade) => {
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
    probit.on('openorder', (order) => {
    })
    probit.on('orderbook', (order) => {
        /* 
        {   symbol: 'BTC-USDT',
            lag: 0,
            side: 'buy',
            price: 10241.4,
            quantity: 0.035501
        }
        */
    })
    probit.on('orderbookL0', (order) => {
        /*
        {   symbol: 'BTC-USDT',
            lag: 0,
            side: 'sell',
            price: 10290,
            quantity: 0.021851 
        }
        */
    })
    probit.on('orderbookL1', (order) => {
        /*
        {   symbol: 'BTC-USDT',
            lag: 0,
            side: 'buy',
            price: 10267,
            quantity: 0.469602
        }
        */
    })
    probit.on('orderbookL2', (order) => {
        /*
        {   symbol: 'BTC-USDT',
            lag: 0,
            side: 'buy',
            price: 10260,
            quantity: 2.746949 
        }
        */
    })
    probit.on('orderbookL3', (order) => {
        /*
        {   symbol: 'BTC-USDT',
            lag: 0,
            side: 'buy',
            price: 10200,
            quantity: 9.881496 
        }
        */
    })
    probit.on('orderbookL4', (order) => {
        /*
        {   symbol: 'BTC-USDT',
            lag: 0,
            side: 'buy',
            price: 8000,
            quantity: 0.000494
        }
        */
    })
    probit.on('orderhistory', (history) => {
    })
    probit.on('tradehistory', (history) => {
    })
```