const https = require('https');
const configFile = require('./config.json');

function httpsPost({body, ...options}) {
  return new Promise((resolve,reject) => {
    const req = https.request({
      method: 'POST',
      ...options,
    }, res => {
      const chunks = [];
      res.on('data', data => chunks.push(data))
      res.on('end', () => {
        let body = Buffer.concat(chunks);
        switch(res.headers['content-type']) {
          case 'application/json':
            body = JSON.parse(body);
            break;
        }
        resolve(body)
      })
    })
    req.on('error',reject);
    if(body) {
      req.write(body);
    }
    req.end();
  })
}

async function getToken() {
  let expiresAt = (Math.floor(Date.now() / 1000) + configFile["token_lifetime"]).toString();

  const res = await httpsPost({
    hostname: 'liveapi-sandbox.yext.com',
    path: '/v2/tokens',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "api_key": configFile["api_key"],
      "expires_in": configFile["token_lifetime"],
      "auth_identifier": "3566804193061889278",
      "fixed_query_params": configFile["fixed_query_parameters"],
      "signing_algorithm": configFile["signing_alg"]
    })
  });

  return [res.body['token'], expiresAt]
}

module.exports ={
  getToken
}
