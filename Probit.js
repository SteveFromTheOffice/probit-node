const EventEmitter = require("./EventEmitter.js");
const ProbitRest   = require("./ProbitRest.js");
const ProbitSocket = require("./ProbitSocket.js");

class Probit extends EventEmitter {

    constructor(key = '', secret = '', demo = false) {
        super();

        this.socket = new ProbitSocket(key, secret, demo);
            this.socket.on('balance', (balance) => {
                this.emit('balance', balance);
            });
            this.socket.on('ticker', (ticker) => {
                this.emit('ticker', ticker);
            });
            this.socket.on('trade', (trade) => {
                this.emit('trade', trade);
            });
            this.socket.on('order', (order) => {
                this.emit('order', order);
            });
            this.socket.on('orderbook', (orderbook) => {
                this.emit('orderbook', orderbook);
            });
            this.socket.on('orderbookL0', (orderbook) => {
                this.emit('orderbookL0', orderbook);
            });
            this.socket.on('orderbookL1', (orderbook) => {
                this.emit('orderbookL1', orderbook);
            });
            this.socket.on('orderbookL2', (orderbook) => {
                this.emit('orderbookL2', orderbook);
            });
            this.socket.on('orderbookL3', (orderbook) => {
                this.emit('orderbookL3', orderbook);
            });
            this.socket.on('orderbookL4', (orderbook) => {
                this.emit('orderbookL4', orderbook);
            });
            this.socket.on('tradehistory', (tradehistory) => {
                this.emit('tradehistory', tradehistory);
            });

        this.rest = new ProbitRest(key, secret, demo);
            this.rest.on('ready', () => {
                this.emit('ready');
            });

    }

}

module.exports = Probit;