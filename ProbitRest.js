const fetch = require('node-fetch');

class ProbitRest {
    constructor(key, secret) {
        this.key = key;
        this.secret = secret;
        this.tokenUrl = 'https://accounts.probit.com/"';
    }

    async token(key, secret) {
        const res = await fetch(`${this.tokenUrl}/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + Base64.encode(`${key}:${secret}`)
            },
            body: JSON.stringify({ grant_type: 'client_credentials' })
        });
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        return res.json();
    }
}
module.exports = ProbitRest;