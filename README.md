# probit-node

Work in progress. <3

```javascript
const Probit = require('./Probit.js');

let probit = new Probit("ID", "SECRET", false);
    probit.on('ready', () => {
    })
    probit.on('balance', (balance) => {
        console.log(balance);
    })
    probit.on('ticker', (ticker) => {
        /*
        { symbol: 'BTC-USDT',
          lag: 0,
          last: '10278.3',
          low: '8602',
          high: '10320.8',
          change: '523.3',
          baseVolume: '528.2132971',
          quoteVolume: '5290229.4313022',
          timestamp: '2020-02-12T03:25:50.000Z'
        }
        */
    })
    probit.on('trade', (trade) => {
    })
    probit.on('openorder', (order) => {
    })
    probit.on('orderbook', (order) => {
    })
    probit.on('orderbookL0', (order) => {
    })
    probit.on('orderbookL1', (order) => {
    })
    probit.on('orderbookL2', (order) => {
    })
    probit.on('orderbookL3', (order) => {
    })
    probit.on('orderbookL4', (order) => {
    })
    probit.on('orderhistory', (history) => {
        console.log(history);
    })
    probit.on('tradehistory', (history) => {
        console.log(history);
    })
```