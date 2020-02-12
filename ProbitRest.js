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
        const res = await fetch(`${this.exchangeUrl}/time?market_ids=${tickers.join(',')}`);
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        return res.json();
    }

    async orderBook(marketId) {
        const res = await fetch(`${this.exchangeUrl}/ticker?market_id=${marketId}`);
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        return res.json();
    }

    async trade(marketId, startTime, endTime, limit) {
        const res = await fetch(`${this.exchangeUrl}/trade?market_id=${marketId}&start_time=${startTime.toISOString()}&end_time=${endTime}&limit=${limit}`);
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        return res.json();
    }

    async newLimitOrder(markerId, side, timeInForce, limitPrice, quantity) {
        const tokenResponse = await this.token();
        const res = await fetch(`${this.exchangeUrl}/new_order`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'authorization': 'Bearer ' + tokenResponse.access_token
            },
            body: JSON.stringify({
                "market_id": markerId,
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
        try {
            return res.json();
        } catch (err) {
            console.log(err);
        }
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
        try {
            return res.json();
        } catch (err) {
            console.log(err);
        }
    }


}
module.exports = ProbitRest;