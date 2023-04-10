import { CosmWasmClient } from "cosmwasm";
import { PassThrough } from "stream";
import * as data from "../../data/pools_list.json";
import { ExecuteEvent, Message, TradingHist } from "../../types";


// This is your contract address
// const contractAddr =
//   "juno1v6stcdrvwrthfvcwvlmmzht32ft9g9nw85tthcjqer242xg3nvdq8fjasx";

// async function main() {
  

//   //console.log(JSON.stringify(config));
// }

async function getPriceJuno(): Promise<number> {
  const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=juno-network&vs_currencies=usd');
  const data = await response.json();
  const price = data['juno-network']['usd'];
  return price;
};

async function getContractLiquidities(contractAddr: string): Promise<any>{
  const rpcEndpoint = "https://rpc-archive.junonetwork.io/";
  const client = await CosmWasmClient.connect(rpcEndpoint);
  const config = await client.queryContractSmart(contractAddr, { pool: {} });
  const liquidities = {
    [config.assets[0]?.info?.native_token?.denom ?? 'denom1']:config.assets[0].amount,
    [config.assets[1]?.info?.native_token?.denom ?? 'denom2']:config.assets[1].amount
  };

  return liquidities;

}


async function createLiquidityObject(liquidities_temps:any,pool:any, prices:any): Promise<any>{
  let decimal1 = pool.pool_assets[0].decimals;
  let decimal2 = pool.pool_assets[1].decimals;
  let l1 = liquidities_temps[pool.pool_assets[0].denom]/10**decimal1;
  let l2 = liquidities_temps[pool.pool_assets[1].denom]/10**decimal2;

  
  let liquidity = {
    "poolId": pool.pool_id ,
    "token_1": {
        "liquidity":l1,
        "liquidity_usd":prices[pool.pool_assets[0].denom] * l1,
        "denom":pool.pool_assets[0].denom
            },
    "token_2": {
      "liquidity":l2,
      "liquidity_usd":prices[pool.pool_assets[1].denom] *l2,
      "denom":pool.pool_assets[1].denom
          },
    "ratio": prices[pool.pool_assets[0].denom]/prices[pool.pool_assets[1].denom]
  };

  return liquidity;

}


export const getPricesLiquidities =  async () => {
  let prices = [];

  const juno_price = await  getPriceJuno();
  
  let token_juno = {
    "symbol":"JUNO",
    "denom":"ujuno",
    "price":juno_price
  }

  let token_usdc = {
    "symbol":"axlUSDC",
    "denom":"ibc/EAC38D55372F38F1AFD68DF7FE9EF762DCF69F26520643CF3F9D292A738D8034",
    "price":1
  }


  prices.push(token_juno,token_usdc);

  let prices_already_calculated = 
    {
      "ujuno":juno_price,
      "ibc/EAC38D55372F38F1AFD68DF7FE9EF762DCF69F26520643CF3F9D292A738D8034":1,
    };


  let liquidities = [];

  for (const pool of data.pools) {

    const token1_denom = pool.pool_assets[0].denom;
    const token2_denom = pool.pool_assets[1].denom;
    let liquidities_temps = await getContractLiquidities(pool.swap_address);
    
    if((token1_denom in prices_already_calculated )&& (token2_denom in prices_already_calculated )){ 
      
       logger.info("Already know theses prices " + pool.pool_id 
      + JSON.stringify(prices) )

     liquidities.push( await createLiquidityObject(liquidities_temps, pool,prices_already_calculated));
     
     ;
    } else if((token1_denom in prices_already_calculated && !(token2_denom in prices_already_calculated )) ||
                  (!(token1_denom in prices_already_calculated) && token2_denom in prices_already_calculated ))
    {
      // if we know token 1 but not the other
      
      if(!('denom1' in liquidities_temps) || !('denom2' in liquidities_temps))
      {

      if(!(token2_denom in prices_already_calculated ) && (token1_denom in prices_already_calculated ))
      {
       
        
        let token2_price = prices_already_calculated[token1_denom]*liquidities_temps[token1_denom]/liquidities_temps[token2_denom];
        
        prices_already_calculated = { ...prices_already_calculated, [token2_denom]: token2_price };
        prices.push(
          {
            "symbol":pool.pool_assets[1].symbol,
            "denom":token2_denom,
            "price":token2_price
          }

        )

      }else if(!(token1_denom in prices_already_calculated )&& (token2_denom in prices_already_calculated ))
      {
        let token1_price = prices_already_calculated[token2_denom]*liquidities_temps[token2_denom]/liquidities_temps[token1_denom];

        prices_already_calculated = { ...prices_already_calculated, [token1_denom]: token1_price };
        prices.push(
          {
            "symbol":pool.pool_assets[0].symbol,
            "denom":token1_denom,
            "price":token1_price
          });
      }
    liquidities.push(await createLiquidityObject(liquidities_temps, pool,prices_already_calculated));
    }else
    {

      prices.push(
        {
          "symbol":pool.pool_assets[0].symbol,
          "denom":token1_denom,
          "price":0
        },
        {
          "symbol":pool.pool_assets[1].symbol,
          "denom":token2_denom,
          "price":0
        }
        );
        logger.info("The 2 tokens haven't prices " + pool.pool_id);
        let dict_temp = {
          token1_denom:0,
          token2_denom:0

        }
        liquidities.push( await createLiquidityObject(liquidities_temps, pool,dict_temp));
    }

    }

  }

let result = {
"prices" : prices,
"liquidities" : liquidities
};

return result;
};



// export const getPrices = async (pools: any, pool: any) => {

//   const token1_denom = pool.pool_assets[0].denom;
//   const token2_denom = pool.pool_assets[1].denom;

//   let juno_price =await getPriceJuno();

//   if(token1_denom=="ibc/EAC38D55372F38F1AFD68DF7FE9EF762DCF69F26520643CF3F9D292A738D8034"){
//     juno_price = await getPriceJuno();
//   }


  
  
//   let token_juno = {
//     "symbol":"JUNO",
//     "denom":"ujuno",
//     "price":juno_price
//   }

//   let token_usdc = = {
//     "symbol":"axlUSDC",
//     "denom":"ibc/EAC38D55372F38F1AFD68DF7FE9EF762DCF69F26520643CF3F9D292A738D8034",
//     "price":1
//   }


// }