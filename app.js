const {getPriceCoin} = require('./src/compareCoinPrices');
const {getAllSymbol, sortCommonCoin} = require('./src/symbol');
const fs = require('fs');



getAllSymbol().then(async (response) => {
  let available_pair = [];
  let common_currency = sortCommonCoin({kucoin_coins_data : response.kucoin_coins_data, ftx_coins_data : response.ftx_coins_data});

  for(currency_detail of common_currency)
  {
    await getPriceCoin({kucoin_coin_data : currency_detail.kucoin_coin_data, ftx_coin_data : currency_detail.ftx_coin_data}).then((response) => {
      if(response.kucoin_coin_price_detail != undefined && response.ftx_coin_price_detail != undefined)
      {
        available_pair.push(response);
      }
    })
  }

  let res = [];
  for(data of available_pair)
  {
    const kucoin_ask = data.kucoin_coin_price_detail.data.bestAsk;
    const kucoin_bid = data.kucoin_coin_price_detail.data.bestBid;
    const ftx_ask = data.ftx_coin_price_detail.result.ask;
    const ftx_bid = data.ftx_coin_price_detail.result.bid;

    const diff_price = ftx_bid * 100.0 / kucoin_ask - 100.0;
    res.push({coin_kucoin : data.ftx_coin_price_detail.result.name, diff_price : diff_price});
    
    let array = {
      KUCOIN : {
        KUCOIN : `kucoin_ask | kucoin_bid -> ${kucoin_ask}, ${kucoin_bid}`,
        FTX : `X`
      },
      FTX : {
        KUCOIN : "X",
        FTX : `ftx_ask | ftx_bid -> ${ftx_ask}, ${ftx_bid}`
      }
    };
    console.log(`PAIR -> ${data.ftx_coin_price_detail.result.name}`);
    console.table(array);
    console.log('');

    if(ftx_bid != 'undefined' || kucoin_ask != 'undefined')
    {
      if(ftx_bid > kucoin_ask)
      {
        const diff_price = ftx_bid * 100.0 / kucoin_ask - 100.0;
        res.push({coin_kucoin : data.ftx_coin_price_detail.result.name, diff_price : diff_price});
      }
    }
  }
})
