import fetch from 'node-fetch';

async function getPriceJuno(): Promise<number> {
  const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=juno-network&vs_currencies=usd');
  const json = await response.json();
  const price = json['juno-network']['usd'];
  return price;
}


getPriceJuno().then(price => {
  console.log(`Le prix de Juno Network en USD est de ${price}`);
}).catch(error => {
  console.error(`Erreur lors de la récupération du prix de Juno Network : ${error}`);
});