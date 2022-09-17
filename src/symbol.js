const axios = require('axios')

const EXCHANGES = ['KUCOIN', 'FTX', 'HUOBI'];

const getAllSymbol = () =>
{
  const url_kucoin = 'https://api.kucoin.com/api/v1/currencies';
  const url_ftx = 'https://ftx.com/api/wallet/coins';
  const url_huobi = 'https://api.huobi.pro/v2/settings/common/currencies'
  //const url_gate = 'https://api.gateio.ws/api/v4/spot/currencies' --> acces au coin mais pas leurs nom complet ..
  //const url_bitstamp = https://www.bitstamp.net/api/v2/ticker/ --> acces simplement aus pair /USDT et BTC
  let kucoin_coins_data;
  let ftx_coins_data;
  let huobi_coins_data;

  return new Promise(async (resolve, reject) => {
    try {
      await axios.get(url_kucoin)
      .then(response => {
        if(response.status == 200)
        {
          kucoin_coins_data = response.data.data;
        }
      })
      .catch(error => {
        console.log(error);
        reject(error);
      });

      await axios.get(url_ftx)
      .then(response => {
        if(response.status == 200)
        {
          ftx_coins_data = response.data.result;
        }
      })
      .catch(error => {
        console.log(error);
        reject(error);
      });

      await axios.get(url_huobi)
      .then(response => {
        if(response.status === "ok")
        {
          huobi_coins_data = response.data;
        }
      })
      .catch(error => {
        console.log(error);
        reject(error);
      });

    } catch (e) {
      console.log(error);
    }

    resolve({kucoin_coins_data : kucoin_coins_data, ftx_coins_data : ftx_coins_data, huobi_coins_data : huobi_coins_data});
  })
}


const coinEqual = (exchange0, coin_data0, exchange1, coin_data1) => {
  let name0;
  let name1;

  if(exchange0 == 'KUCOIN')
  {
    name0 = coin_data0.fullName;
  }
  else if (exchange0 == 'FTX')
  {
    name0 = coin_data0.name;
  }

  if(exchange1 == 'KUCOIN')
  {
    name1 = coin_data1.fullName;
  }
  else if (exchange1 == 'FTX')
  {
    name1 = coin_data1.name;
  }

  return (name0 == name1);
}

const sortCommonCoin = ({kucoin_coins_data : kucoin_coins_data, ftx_coins_data : ftx_coins_data}) => {
  let unsorted_currency = [kucoin_coins_data, ftx_coins_data];
  let common_currency = [];
  let obj_tmp = {kucoin_coin_data : undefined, ftx_coin_data : undefined};

  for(let i = 0 ; i < unsorted_currency.length ; i++)
  {
    for(let j = 0 ; j < unsorted_currency.length ; j++)
    {
      if(i != j && j > i)
      {
        for(let k = 0 ; k < unsorted_currency[i].length ; k++)
        {
          for(let l = 0 ; l < unsorted_currency[j].length ; l++)
          {
            if(unsorted_currency[i][k] != undefined && unsorted_currency[i][l] != undefined)
            {
              if(coinEqual(EXCHANGES[i], unsorted_currency[i][k], EXCHANGES[j], unsorted_currency[j][l]))
              {
                if(EXCHANGES[i] == 'KUCOIN')
                {
                  obj_tmp.kucoin_coin_data = unsorted_currency[i][k];
                }
                else if (EXCHANGES[i] == 'FTX')
                {
                  obj_tmp.ftx_coin_data = unsorted_currency[i][k];
                }

                if(EXCHANGES[j] == 'KUCOIN')
                {
                  obj_tmp.kucoin_coin_data = unsorted_currency[j][l];
                }
                else if (EXCHANGES[j] == 'FTX')
                {
                  obj_tmp.ftx_coin_data = unsorted_currency[j][l];
                }
                //console.log(obj_tmp)
                common_currency.push(obj_tmp);
                obj_tmp = {kucoin_coin_data : undefined, ftx_coin_data : undefined};
              }
            }
          }
        }
      }
    }
  }
  return common_currency;
}

module.exports = {getAllSymbol, sortCommonCoin}
