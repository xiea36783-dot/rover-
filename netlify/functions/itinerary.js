const https = require(‘https’);

exports.handler = async function(event) {
if(event.httpMethod !== ‘POST’) {
return {statusCode:405,body:‘Method not allowed’};
}

const headers = {
‘Content-Type’: ‘application/json’,
‘Access-Control-Allow-Origin’: ‘*’
};

try {
const {prompt} = JSON.parse(event.body);
if(!prompt) return {statusCode:400,headers,body:JSON.stringify({error:‘Missing prompt’})};

```
const payload = JSON.stringify({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 2000,
  messages: [{role:'user',content:prompt}]
});

const result = await new Promise((resolve,reject) => {
  const req = https.request({
    hostname: 'api.anthropic.com',
    path: '/v1/messages',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
      'x-api-key': process.env.ANTHROPIC_API_KEY || ''
    }
  }, (res) => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => {
      try {
        const parsed = JSON.parse(d);
        resolve(parsed);
      } catch(e) {
        reject(new Error('Parse error: '+d.slice(0,200)));
      }
    });
  });
  req.on('error', reject);
  req.write(payload);
  req.end();
});

if(result.error) {
  return {statusCode:400,headers,body:JSON.stringify({error:result.error.message})};
}

const content = result.content?.[0]?.text || '';
return {statusCode:200,headers,body:JSON.stringify({content})};
```

} catch(e) {
return {statusCode:500,headers,body:JSON.stringify({error:e.message})};
}
};
