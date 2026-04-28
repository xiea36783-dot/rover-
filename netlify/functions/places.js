const https = require('https');
exports.handler = async function(event) {
  const { query, type, action, place_id } = event.queryStringParameters || {};
  const GKEY = 'AIzaSyDegBY5wqNKPshtxbMkyXhpYSNYuEjT9mk';
  const headers = {'Content-Type':'application/json','Access-Control-Allow-Origin':'*'};
  let url;
  if(action==='details'&&place_id){
    url=`https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=name,rating,formatted_address,opening_hours,photos,reviews,price_level,website,types&key=${GKEY}`;
  } else if(query){
    const typeMap={attractions:'tourist_attraction',restaurants:'restaurant',hotels:'lodging'};
    const placeType=typeMap[type]||'tourist_attraction';
    url=`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query+' Victoria Australia')}&type=${placeType}&key=${GKEY}`;
  } else {
    return {statusCode:400,headers,body:JSON.stringify({error:'Missing params'})};
  }
  return new Promise(resolve=>{
    https.get(url,res=>{
      let d='';
      res.on('data',c=>d+=c);
      res.on('end',()=>resolve({statusCode:200,headers,body:d}));
    }).on('error',e=>resolve({statusCode:500,headers,body:JSON.stringify({error:e.message})}));
  });
};
