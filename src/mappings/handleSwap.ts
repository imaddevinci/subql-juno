import { TransactionType } from "../config/enum";
import { ExecuteEvent, Message, SwapHistory, TradingHist } from "../types";
import fetch from "node-fetch";
import * as data from "../data/pools_list.json";
//import { CosmWasmClient } from "cosmwasm";
//import {getPricesLiquidities} from "./utils/price"
import {
    saveHistory,
  } from "./utils/save";
  import {
    CosmosEvent,
    CosmosBlock,
    CosmosMessage,
    CosmosTransaction,
  } from "@subql/types-cosmos";
  import { parseAttrs, hasType, insightAsset, insightPools, parseAttrsMultiple, insightAssetFromPOOL, parseAttrsMessage } from "./utils/pair";
//  import { getPriceJuno, getPriceAtom } from "../lib/num";
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';

   async function getPriceJuno(): Promise<number> {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=juno-network&vs_currencies=usd');
    const data = await response.json();
    const price = data['juno-network']['usd'];
    return price;
  }

 async function getPriceAtom(): Promise<number> {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=cosmos&vs_currencies=usd');
    const data = await response.json();
    const price = data['cosmos']['usd'];
    return price;
  }

  async function getContractLiquidities(contractAddr: string): Promise<any>{
    const rpcEndpoint = "https://rpc-archive.junonetwork.io/";
    let apiUns = CosmWasmClient.connect(rpcEndpoint);
    
    const config =  (await apiUns).queryContractSmart(contractAddr, { pool: {} });
    logger.info("Already know theses prices "
        + JSON.stringify(config) );


    //const client = await CosmWasmClient.connect(rpcEndpoint);
    //const queryClient = new QueryClient(rpcEndpoint);

   // const config = await client.queryContractSmart(contractAddr, { pool: {} });
    // const liquidities = {
    //   [config.assets[0]?.info?.native_token?.denom ?? 'denom1']:config.assets[0].amount,
    //   [config.assets[1]?.info?.native_token?.denom ?? 'denom2']:config.assets[1].amount
    // };
    const liquidities = {};
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


  export const getPricesLiquidities = async () => {
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
    let liquidities_temps = await getContractLiquidities("juno1p9z8xe96fyvg3h5gtvnpjjv2u47q6l7sdhg6asmyfgc6q8l8ttgqfvxnxh");
  
  let result = {
  "prices" : 1,
  "liquidities" : 1
  };
  
  return result;
  };



  export async function handleSwapEvent(event: any): Promise<void> {
    const attributes = event.event.attributes;
    
    if (!hasType(attributes, TransactionType.SWAP)) return;

    const data = await parseAttrs(attributes, TransactionType.SWAP);
    logger.info("Dealing with Swap " + data._contract_address);
    const temps_element = await getPricesLiquidities();


    let swapRecord = SwapHistory.create({
      id: `${event.tx.hash}-${event.msg.idx}-${event.idx}`,
      datetime: new Date(Date.parse(event.block.block.header.time)),
      blockHeight : BigInt(event.block.block.header.height),
      tokenSpendVolume:"tokenSpendVol",
      tokenSpendUsd:"tokenSpendUSD",
      denomSpend:"offer_asset.denom",
      address:event.msg?.msg?.decodedMsg?.sender,
      tokenBoughtVolume:"tokenBoughtVol",
      tokenBoughtUsd:"tokenBoughtUSD",
      denomBought:"ask_asset.denom",
      pairAddr: "poolUsed.swap_address",
      lpToken:"poolUsed.lp_token",
      poolId:"poolUsed.pool_id",
      txHash:event.tx.hash,

      swapFeeVolume: "" ,
  })
  await swapRecord.save();

}
  