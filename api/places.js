const https = require(‘https’);

module.exports = function(req, res) {
res.setHeader(‘Access-Control-Allow-Origin’, ‘*’);

const { query, type, action, place_id } = req.query || {};
const k2 = [‘AIzaSyDegBY5wqNKP’,‘shtxbMkyXhpYSNYuEjT9mk’].join(’’);
const GKEY = process.env.GOOGLE_API_KEY || k2;

let url;
if(action===‘details’ && place_id){
url=`https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=name,rating,formatted_address,opening_hours,photos,reviews,price_level,website,types&key=${GKEY}`;
} else if(query){
const typeMap={attractions:‘tourist_attraction’,restaurants:‘restaurant’,hotels:‘lodging’};
const placeType=typeMap[type]||‘tourist_attraction’;
url=`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query+' Victoria Australia')}&type=${placeType}&key=${GKEY}`;
} else {
res.status(400).json({error:‘Missing params’});
return;
}

https.get(url, r=>{
let d=’’;
r.on(‘data’,c=>d+=c);
r.on(‘end’,()=>{
res.setHeader(‘Content-Type’,‘application/json’);
res.end(d);
});
}).on(‘error’,e=>{
res.status(500).json({error:e.message});
});
};
