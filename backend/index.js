const Koa = require('koa');
const Router = require('@koa/router');
const cors = require('@koa/cors');
const CoinMarketCap = require('coinmarketcap-api') 
const apiKey = '75341fe7-3876-46bc-82e4-c97b159e4216'

const app = new Koa();
const router = new Router();


//generate a paymentId for purchage
router.get('/api/getBCData', async (ctx, next) => {
  //1. get items from db
  var data;
  const client = new CoinMarketCap(apiKey) 

  await client.getQuotes({symbol: 'GHOST'}).then(function(result){
    console.log(result);
    data = result.data;
    console.log("data : "+ JSON.stringify(data));
  }).catch(console.error)
 
  ctx.body = {
         data
      }  
});  

app
  .use(cors())
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(4000, () => {
  console.log('Server running on port 4000');
});

