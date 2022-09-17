const axios = require('axios');

const getPriceCoin = ({kucoin_coin_data : kucoin_coin_data, ftx_coin_data : ftx_coin_data}) => {
  const url_kucoin = 'https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=' + kucoin_coin_data.currency + '-USDT'
  const url_ftx = 'https://ftx.com/api/markets/' + ftx_coin_data.id + '/USDT'

  let kucoin_coin_price_detail
  let ftx_coin_price_detail

  return new Promise(async (resolve, reject) => {
    await axios.get(url_kucoin)
      .then((response) => {
        if(response.status == 200)
        {
          if(response.data.data != null)
          {
            kucoin_coin_price_detail = response.data
          }
        }
      })
      .catch((error) => {
        //reject(error)
    })

    await axios.get(url_ftx)
      .then((response) => {
        if(response.status == 200)
        {
          ftx_coin_price_detail = response.data
        }
      })
      .catch((error) => {
        //reject(error)
    })

    resolve({kucoin_coin_price_detail : kucoin_coin_price_detail, ftx_coin_price_detail : ftx_coin_price_detail})
  })
}

module.exports = {getPriceCoin}
