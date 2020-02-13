const EventEmitter = require('./EventEmitter.js');
const fetch        = require('node-fetch');

class ProbitRest extends EventEmitter {
    constructor(key, secret) {
        super();

        this.exchangeUrl = 'https://api.probit.com/api/exchange/v1';

        this._updateToken(key, secret);
    }

    async market() {
        return await this._request('GET', '/market');
    }

    async currency() {
        return await this._request('GET', '/currency');
    }

    async time() {
        return await this._request('GET', '/time');
    }

    async ticker(tickers) {
        return await this._request('GET', '/ticker?market_ids=' + tickers.join(','));
    }

    async orderBook(marketId) {
        return await this._request('GET', '/order_book?market_id=' + marketId);
    }

    async trade(marketId, startTime, endTime, limit) {
        return await this._request('GET', `/trade?market_id=${marketId}&start_time=${startTime}&end_time=${endTime}&limit=${limit}`);
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
                "quantity": quantity.toString()
            })
        })
            .then(res => res.json())
            .then((json) => { return json; })
            .catch((error) => {
                throw new Error(error);
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
            .then(res => res.json())
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
                "market_id": marketId.toString(),
                "order_id": orderId.toString()

            })
        })
        .then(res => res.json() )
        .then((json) => { return json; })
        .catch((error) => {
            throw new Error(error);
        });
    }

    async orderHistory(startTime, endTime, limit, marketId) {
        return await this._requestAuthenticated('GET', `/order_history?start_time=${startTime}&end_time=${endTime}&limit=${limit}&market_id=${marketId}`);
    }

    async tradeHistory(startTime, endTime, limit, marketId) {
        return await this._requestAuthenticated('GET', `/trade_history?market_id=${marketId}&start_time=${startTime}&end_time=${endTime}&limit=${limit}`);
    }

    async balance() {
        return await this._requestAuthenticated('GET', `/balance`);
    }

    async order(marketId, orderId) {
        return await this._requestAuthenticated('GET', `/order?market_id=${marketId}&order_id=${orderId}`);
    }

    async openOrder(marketId) {
        return await this._requestAuthenticated('GET', `/open_order?market_id=${marketId}`);
    }

    async _request(method, path) {

        return fetch(this.exchangeUrl + path, { method: method })
            .then(res => res.json() )
            .then((json) => { return json.data; })
            .catch((error) => {
                throw new Error(error);
            });

    }

    async _requestAuthenticated(method, path, body = undefined) {

        return fetch(this.exchangeUrl + path, { method: method, headers: { 'Authorization': 'Bearer ' + this.token }, body: JSON.stringify(body) })
            .then(res => res.json() )
            .then((json) => { return json; })
            .catch((error) => {
                console.log(error);
            });
    }

    _updateToken(key, secret) {
        let auth = new Buffer(`${key}:${secret}`).toString('base64');
        let body = JSON.stringify({ grant_type: 'client_credentials' });
        let url  = 'https://accounts.probit.com/token';

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