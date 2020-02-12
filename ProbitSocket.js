const EventEmitter = require('./EventEmitter.js');
const SuperAgent   = require("superagent");
const WebSocket    = require('ws');

class ProbitSocket extends EventEmitter {

    constructor(key, secret, demo = false) {
        super();

        this.server = new WebSocket(!demo ? 'wss://api.probit.com/api/exchange/v1/ws' : 'wss://demo-api.probit.com/api/exchange/v1/ws');
        this.server.on('open', () => {
            this._authenticate(key, secret);
        });
        this.server.on('message', (data) => {

            let message = JSON.parse(data);

            if(message.type == "authorization") {
                message.result == "ok" && this.emit('ready');
                return;
            }

            switch(message.channel) {

                case "balance": {
                    message.data != "{}" && this.emit('balance', message.data);
                    break;
                }
            
                case "marketdata": {

                    // Ticker.
                    message.ticker && this.emit('ticker', {
                        symbol      : message.market_id,
                        lag         : message.lag,
                        last        : Number(message.ticker.last),
                        low         : Number(message.ticker.low),
                        high        : Number(message.ticker.high),
                        change      : Number(message.ticker.change),
                        baseVolume  : Number(message.ticker.base_volume),
                        quoteVolume : Number(message.ticker.quote_volume),
                        timestamp   : message.ticker.time
                    });

                    // Recent trades.
                    message.recent_trades.forEach((trade) => {
                        this.emit('trade', {
                            symbol        : message.market_id,
                            lag           : message.lag,
                            id            : trade.id,
                            quantity      : Number(trade.quantity),
                            side          : trade.side,
                            tickDirection : trade.tick_direction,
                            timestamp     : trade.time
                        })
                    });

                    // Order Books.
                    message.order_books && message.order_books.forEach((order) => {
                        this.emit('orderbook', {
                            symbol   : message.market_id,
                            lag      : Number(message.lag),
                            side     : order.side,
                            price    : Number(order.price),
                            quantity : Number(order.quantity)
                        });
                    });

                    // Order Books L0.
                    message.order_books && message.order_books_l0.forEach((order) => {
                        this.emit('orderbookL0', {
                            symbol   : message.market_id,
                            lag      : Number(message.lag),
                            side     : order.side,
                            price    : Number(order.price),
                            quantity : Number(order.quantity)
                        });
                    });

                    // Order Books L1.
                    message.order_books && message.order_books_l1.forEach((order) => {
                        this.emit('orderbookL1', {
                            symbol   : message.market_id,
                            lag      : Number(message.lag),
                            side     : order.side,
                            price    : Number(order.price),
                            quantity : Number(order.quantity)
                        });
                    });

                    // Order Books L2.
                    message.order_books && message.order_books_l2.forEach((order) => {
                        this.emit('orderbookL2', {
                            symbol   : message.market_id,
                            lag      : Number(message.lag),
                            side     : order.side,
                            price    : Number(order.price),
                            quantity : Number(order.quantity)
                        });
                    });

                    // Order Books L3.
                    message.order_books && message.order_books_l3.forEach((order) => {
                        this.emit('orderbookL3', {
                            symbol   : message.market_id,
                            lag      : Number(message.lag),
                            side     : order.side,
                            price    : Number(order.price),
                            quantity : Number(order.quantity)
                        });
                    });

                    // Order Books L4.
                    message.order_books && message.order_books_l4.forEach((order) => {
                        this.emit('orderbookL4', {
                            symbol   : message.market_id,
                            lag      : Number(message.lag),
                            side     : order.side,
                            price    : Number(order.price),
                            quantity : Number(order.quantity)
                        });
                    });

                    break;
                }

                case "open_order": {
                    message.data.forEach((order) => {
                        this.emit('order', {
                            id                : Number(order.id),
                            userId            : order.user_id,
                            type              : order.type,
                            side              : order.side,
                            quantity          : Number(order.quantity),
                            price             : Number(order.limit_price),
                            timeInForce       : order.time_in_force,
                            filledCost        : Number(order.filled_cost),
                            filledQuantity    : Number(order.filled_quantity),
                            openQuantity      : Number(order.open_quantity),
                            cancelledQuantity : Number(order.cancelled_quantity),
                            status            : order.status,
                            timestamp         : order.time,
                            clientOrderId     : order.client_order_id
                        });
                    });
                    break;
                }

                case "order_history": {
                    message.data.forEach((order) => {
                        this.emit('order', {
                            //clickity clickity clack, my mouse goes up the back. the clock strikes one, my shirt cones undone. and all the boys give me pretty horse gifts wait what.
                            id                : Number(order.id),
                            userId            : order.user_id,
                            type              : order.type,
                            side              : order.side,
                            quantity          : Number(order.quantity),
                            price             : Number(order.limit_price),
                            timeInForce       : order.time_in_force,
                            filledCost        : Number(order.filled_cost),
                            filledQuantity    : Number(order.filled_quantity),
                            openQuantity      : Number(order.open_quantity),
                            cancelledQuantity : Number(order.cancelled_quantity),
                            status            : order.status,
                            timestamp         : order.time,
                            clientOrderId     : order.client_order_id
                        });
                    });
                    break;
                }

                case "trade_history": {
                    message.data.forEach((trade) => {
                        this.emit('tradehistory', {
                            id            : trade.id,
                            orderId       : Number(trade.order_id),
                            side          : 'buy',
                            feeAmount     : Number(trade.fee_amount),
                            feeCurrencyId : 'PROB',
                            status        : 'settled',
                            price         : Number(trade.price),
                            quantity      : Number(trade.quantity),
                            cost          : Number(trade.cost),
                            time          : '2020-02-11T03:36:37.462Z',
                            market_id     : 'PROB-BTC'
                        })
                    });
                    break;
                }

                default: {
                    console.log(message);
                    break;
                }

            }

        });
    }

    subscribe(symbol, filter = []) {
        this.server.send(JSON.stringify({"type":"subscribe","channel":"marketdata","market_id":symbol,"interval":100,"filter":filter}));
    }

    _authenticate(key, secret) {

        let auth = "Basic " + new Buffer(key+":"+secret).toString('base64');
        let body = JSON.stringify({ grant_type: 'client_credentials' });

        SuperAgent.post('https://accounts.probit.com/token')
            .set('Content-Type', 'application/json')
            .set('Authorization', auth)
            .send(body)
            .then((result) => {
                this.server.send(JSON.stringify({"type":"authorization","token":result.body.access_token}));
                this.server.send(JSON.stringify({"type":"subscribe","channel":"balance"}));
                this.server.send(JSON.stringify({"type":"subscribe","channel":"open_order"}));
                this.server.send(JSON.stringify({"type":"subscribe","channel":"order_history"}));
                this.server.send(JSON.stringify({"type":"subscribe","channel":"trade_history"}));
            })
            .catch((error) => {
                console.log("Probit._autenticate() : " + error.message);
            });
       
    }

}

module.exports = ProbitSocket;