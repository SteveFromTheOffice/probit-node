const EventEmitter = require('./EventEmitter.js');
const SuperAgent   = require('superagent');

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
        return await this._requestAuthenticated("POST", "/new_order", {
            "market_id"     : marketId,
            "type"          : "limit",
            "side"          : side,
            "time_in_force" : timeInForce,
            "limit_price"   : limitPrice.toString(),
            "quantity"      : quantity.toString()
        });
    }

    async newMarketOrder(marketId, quantity, side, timeInForce) {
        return await this._requestAuthenticated("POST", "/new_order", {
            "market_id"     : marketId,
            "quantity"      : quantity.toString(),
            "side"          : side,
            "time_in_force" : timeInForce,
            "type"          : "market"
        });
    }

    async cancelOrder(marketId, orderId) {
        return await this._requestAuthenticated('POST', '/cancel_order', {
            "market_id" : marketId.toString(),
            "order_id"  : orderId.toString()
        });
    }

    async orderHistory(startTime, endTime, limit, marketId) {
        startTime = new Date(startTime).toISOString();
        endTime   = new Date(endTime).toISOString();

        return await this._requestAuthenticated('GET', `/order_history?start_time=${startTime}&end_time=${endTime}&limit=${limit}&market_id=${marketId}`);
    }

    async tradeHistory(startTime, endTime, limit, marketId) {
        startTime = new Date(startTime).toISOString();
        endTime   = new Date(endTime).toISOString();

        return await this._requestAuthenticated('GET', `/trade_history?market_id=${marketId}&start_time=${startTime}&end_time=${endTime}&limit=${limit}`);
    }

    async balance() {
        return await this._requestAuthenticated('GET', '/balance');
    }

    async order(marketId, orderId) {
        return await this._requestAuthenticated('GET', `/order?market_id=${marketId}&order_id=${orderId}`);
    }

    async openOrder(marketId) {
        return await this._requestAuthenticated('GET', `/open_order?market_id=${marketId}`);
    }

    async _request(method, path, body = undefined) {

        return SuperAgent(method, this.exchangeUrl + path)
            .set('Content-Type', 'application/json')
            .send(body)
            .then((result) => { return result.body; })
            .catch((error) => {
                console.log(path + " - " + error);
            });

    }

    async _requestAuthenticated(method, path, body = undefined) {

        return SuperAgent(method, this.exchangeUrl + path)
            .set('Authorization', 'Bearer ' + this.token)
            .set('Content-Type', 'application/json')
            .send(body)
            .then((result) => { return result.body; })
            .catch((error) => {
                console.log(path + " - " + error);
            });

    }

    _updateToken(key, secret) {
        let auth = "Basic " + new Buffer(`${key}:${secret}`).toString('base64');
        let body = JSON.stringify({ grant_type: 'client_credentials' });
        let url  = 'https://accounts.probit.com/token';

        SuperAgent.post(url)
            .set('Content-Type', 'application/json')
            .set('Authorization', auth)
            .send(body)
            .then((result) => {
                
                // Set access token.
                if (!this.token) {
                    this.token = result.body.access_token;
                    this.emit('ready');
                }

                this.token = result.body.access_token;

                // Queue next refresh.
                setTimeout(() => {
                    this._updateToken(key, secret);
                }, result.body.expires_in * 1000 - 5000);

            })
            .catch((error) => {
                console.log("ProbitRest._updateToken() : " + error.message);
            });

    }

}

module.exports = ProbitRest;