const {axios} = require('axios')

const get_ContractAddress = ({kucoin_Coin : kucoin_Coin, ftx_Coin : ftx_Coin}) => {
  const url_kucoin  = 'https://api.kucoin.com/api/v2/currencies/' + kucoin_Coin;
  const url_ftx = '';
  let dataKucoin;
  let dataFTX;

  return new Promise((reject, resolve) => {
    axios.get(url_kucoin);
    .then((response) => {
      if(response.status == 200)
      {
        dataKucoin = response.data;
      }
    })
    .catch((error) => {
      console.log('error in kucoin fetch url : ' + error);
      reject(error);
    })

    axios.get(url_ftx);
    .then((response) => {
      if(response.status == 200)
      {
        dataFTX = response.data;
      }
    })
    .catch((error) => {
      console.log('error in binance fetch url : ' + error);
      reject(error);
    })
  })

  resolve({dataKucoin : dataKucoin, dataFTX : dataFTX})
}
