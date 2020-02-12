const EventEmitter = require('./EventEmitter.js');
const fetch = require('node-fetch');

class ProbitRest extends EventEmitter {
    constructor(key, secret) {
        super();

        this._updateToken(key, secret);
    }

    async market() {
        return await this._request('/market');
    }

    async currency() {
        return await this._request('/currency');
    }

    async time() {
        return await this._request('/time');
    }

    async ticker(tickers) {
        return await this._request('/ticker?market_ids=' + tickers.join(','));
    }

    async orderBook(marketId) {
        return await this._request('/order_book?market_id=' + marketId);
    }

    async trade(marketId, startTime, endTime, limit) {
        return await fetch(`${this.exchangeUrl}/trade?market_id=${marketId}&start_time=${startTime}&end_time=${endTime}&limit=${limit}`)
            .then(res => { res.json(); })
            .then((json) => { return json; })
            .catch((error) => {
                throw new Error(error);
            });
    }

    async newLimitOrder(marketId, side, timeInForce, limitPrice, quantity) {
        return await fetch(`${this.exchangeUrl}/new_order`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'authorization': 'Bearer ' + this.token
            },
            body: JSON.stringify({
                    "market_id": marketId,
                    "type": "limit",
                    "side": side,
                    "time_in_force": timeInForce,
                    "limit_price": limitPrice,
                    "quantity": quantity
                })
                .then(res => { res.json(); })
                .then((json) => { return json; })
                .catch((error) => {
                    throw new Error(error);
                })
        });
    }

    async newMarketOrder(marketId, quantity, side, timeInForce) {
        return await fetch(`${this.exchangeUrl}/new_order`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'authorization': 'Bearer ' + this.token
                },
                body: JSON.stringify({
                    "market_id": marketId,
                    "quantity": quantity,
                    "side": side,
                    "time_in_force": timeInForce,
                    "type": "market"
                })
            })
            .then(res => { res.json(); })
            .then((json) => { return json; })
            .catch((error) => {
                throw new Error(error);
            });
    }

    async cancelOrder(marketId, orderId) {
        return await fetch(`${this.exchangeUrl}/cancel_order`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'authorization': 'Bearer ' + this.token
                },
                body: JSON.stringify({
                    "market_id": marketId,
                    "order_id": orderId

                })
            })
            .then(res => { res.json(); })
            .then((json) => { return json; })
            .catch((error) => {
                throw new Error(error);
            });
    }

    async orderHistory(startTime, endTime, limit, marketId) {
        return await fetch(`${this.exchangeUrl}/order_history?start_time=${startTime}&end_time=${endTime}&limit=${limit}&market_id=${marketId}`, {
                method: 'GET',
                headers: {
                    'authorization': 'Bearer ' + this.token
                },
            })
            .then(res => { res.json(); })
            .then((json) => { return json; })
            .catch((error) => {
                throw new Error(error);
            });
    }

    async tradeHistory(startTime, endTime, limit, marketId) {
        return await fetch(`${this.exchangeUrl}/trade_history?market_id=${marketId}&start_time=${startTime}&end_time=${endTime}&limit=${limit}`, {
                method: 'GET',
                headers: {
                    'authorization': 'Bearer ' + this.token
                },
            })
            .then(res => { res.json(); })
            .then((json) => { return json; })
            .catch((error) => {
                throw new Error(error);
            });
    }

    async balance() {
        return await fetch(`${this.exchangeUrl}/balance`, {
                method: 'GET',
                headers: {
                    'authorization': 'Bearer ' + this.token
                },
            })
            .then(res => { res.json(); })
            .then((json) => { return json; })
            .catch((error) => {
                throw new Error(error);
            });
    }

    async order(marketId, orderId) {
        return await fetch(`${this.exchangeUrl}/order?market_id=${marketId}&order_id=${orderId}`, {
                method: 'GET',
                headers: {
                    'authorization': 'Bearer ' + this.token
                },
            })
            .then(res => { res.json(); })
            .then((json) => { return json; })
            .catch((error) => {
                throw new Error(error);
            });
    }

    async openOrder(marketId) {
        return await fetch(`${this.exchangeUrl}/open_order?market_id=${marketId}`, {
                method: 'GET',
                headers: {
                    'authorization': 'Bearer ' + this.token
                },
            })
            .then(res => { res.json(); })
            .then((json) => { return json; })
            .catch((error) => {
                throw new Error(error);
            });

    }

    async _request(path) {

        let url = 'https://api.probit.com/api/exchange/v1' + path;

        return fetch(url)
            .then(res => { res.json(); })
            .then((json) => { return json; })
            .catch((error) => {
                throw new Error(error);
            });

    }

    async _requestAuthorized() {

    }

    _updateToken(key, secret) {
        let auth = new Buffer(`${key}:${secret}`).toString('base64');
        let body = JSON.stringify({ grant_type: 'client_credentials' });
        let url = 'https://accounts.probit.com/token';

        fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Basic ' + auth }, body: body })
            .then(res => res.json())
            .then((json) => {

                // Set access token.
                if (!this.token) {
                    this.token = json.access_token;
                    this.emit('ready');
                }

                this.token = json.access_token;

                // Queue next refresh.
                setTimeout(() => {
                    this._updateToken(key, secret);
                }, json.expires_in * 1000 - 5000);

            })
            .catch((error) => {
                throw new Error(error);
            });

    }

}

module.exports = ProbitRest;