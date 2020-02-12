const fetch = require('node-fetch');

class ProbitRest {
    constructor(key, secret) {
        this.key = key;
        this.secret = secret;
        this.tokenUrl = 'https://accounts.probit.com';
        this.exchangeUrl = 'https://api.probit.com/api/exchange/v1';
    }

    async token() {
        console.log(this.key);
        const res = await fetch(`${this.tokenUrl}/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + new Buffer(`${this.key}:${this.secret}`).toString('base64')
            },
            body: JSON.stringify({ grant_type: 'client_credentials' })
        });
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        try {
            return res.json();
        } catch (err) {
            console.log(err);
        }
    }

    async market() {
        const res = await fetch(`${this.exchangeUrl}/market`);
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        return res.json();
    }

    async currency() {
        const res = await fetch(`${this.exchangeUrl}/currency`);
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        return res.json();
    }

    async time() {
        const res = await fetch(`${this.exchangeUrl}/time`);
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        return res.json();
    }

    async ticker(tickers) {
        const res = await fetch(`${this.exchangeUrl}/ticker?market_ids=${tickers.join(',')}`);
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        return res.json();
    }

    async orderBook(marketId) {
        const res = await fetch(`${this.exchangeUrl}/order_book?market_id=${marketId}`);
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        return res.json();
    }

    async trade(marketId, startTime, endTime, limit) {
        const res = await fetch(`${this.exchangeUrl}/trade?market_id=${marketId}&start_time=${startTime}&end_time=${endTime}&limit=${limit}`);
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        return res.json();
    }

    async newLimitOrder(marketId, side, timeInForce, limitPrice, quantity) {
        const tokenResponse = await this.token();
        const res = await fetch(`${this.exchangeUrl}/new_order`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'authorization': 'Bearer ' + tokenResponse.access_token
            },
            body: JSON.stringify({
                "market_id": marketId,
                "type": "limit",
                "side": side,
                "time_in_force": timeInForce,
                "limit_price": limitPrice,
                "quantity": quantity
            })
        });
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        return res.json();
    }

    async newMarketOrder(marketId, quantity, side, timeInForce) {
        const tokenResponse = await this.token();
        const res = await fetch(`${this.exchangeUrl}/new_order`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'authorization': 'Bearer ' + tokenResponse.access_token
            },
            body: JSON.stringify({
                "market_id": marketId,
                "quantity": quantity,
                "side": side,
                "time_in_force": timeInForce,
                "type": "market"
            })
        });
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        return res.json();
    }

    async cancelOrder(marketId, orderId) {
        const tokenResponse = await this.token();
        const res = await fetch(`${this.exchangeUrl}/cancel_order`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'authorization': 'Bearer ' + tokenResponse.access_token
            },
            body: JSON.stringify({
                "market_id": marketId,
                "order_id": orderId

            })
        });
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        return res.json();
    }

    async orderHistory(startTime, endTime, limit, marketId) {
        const tokenResponse = await this.token();
        const res = await fetch(`${this.exchangeUrl}/order_history?start_time=${startTime}&end_time=${endTime}&limit=${limit}&market_id=${marketId}`, {
            method: 'GET',
            headers: {
                'authorization': 'Bearer ' + tokenResponse.access_token
            },
        });
        if (!res.ok) {
            console.log(res.body)
            throw new Error(res.statusText);
        }
        return res.json();
    }

    async tradeHistory(startTime, endTime, limit, marketId) {
        const tokenResponse = await this.token();
        const res = await fetch(`${this.exchangeUrl}/trade_history?market_id=${marketId}&start_time=${startTime}&end_time=${endTime}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'authorization': 'Bearer ' + tokenResponse.access_token
            },
        });
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        return res.json();
    }

    async balance() {
        const tokenResponse = await this.token();
        const res = await fetch(`${this.exchangeUrl}/balance`, {
            method: 'GET',
            headers: {
                'authorization': 'Bearer ' + tokenResponse.access_token
            },
        });
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        return res.json();
    }

    async order(marketId, orderId) {
        const tokenResponse = await this.token();
        const res = await fetch(`${this.exchangeUrl}/order?market_id=${marketId}&order_id=${orderId}`, {
            method: 'GET',
            headers: {
                'authorization': 'Bearer ' + tokenResponse.access_token
            },
        });
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        return res.json();
    }

    async openOrder(marketId) {
        const tokenResponse = await this.token();
        const res = await fetch(`${this.exchangeUrl}/open_order?market_id=${marketId}`, {
            method: 'GET',
            headers: {
                'authorization': 'Bearer ' + tokenResponse.access_token
            },
        });
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        return res.json();
    }
}
module.exports = ProbitRest;