import { Attribute } from "@cosmjs/stargate/build/logs";
import {
    defaultSwapData
  } from "../../config/constants";
import { TransactionType } from "../../config/enum";

import * as data from "../../data/pools_list.json";

export const insightAsset = (addr?: string) => {
  for (const pool of data.pools) {
      const poolAsset = pool.pool_assets.find(asset => asset.denom === addr);
      if(poolAsset!=undefined){
        return poolAsset        
      }
  }
  return false;
};


export const insightAssetFromPOOL = (pool: any, addr?: string) => {
      const poolAsset = pool.pool_assets.find(asset => asset.denom === addr);
      if(poolAsset!=undefined){
        return poolAsset        
      }
  return false;
};


export const insightPools = (addr?: string) => {
  let poolAsset = data.pools.find(asset => asset.swap_address === addr);
  if(poolAsset!=undefined){
    return poolAsset        
  }
  poolAsset = data.pools.find(asset => asset.lp_token === addr);
  if(poolAsset!=undefined){
    return poolAsset        
  }
  

  return false;
};

export const isUusd = (addr?: string) => {
  return addr && data[addr] && data[addr].symbol === "USDC";
};

export const getDefaultAttrs = (type: string) => {
    let data;
    switch (type) {
      case TransactionType.SWAP:
        data = defaultSwapData;
        break;
    }
    return data;
  };

export const parseAttrs = async (attrs: Attribute[], type: string) => {
    let data = getDefaultAttrs(type);
    attrs.map(({ key, value }) => {
      if (data[key]) return;
      data = { ...data, [key]: value };
    });
  
    return data;
  };





  export const parseAttrsMessage = async (message: any) => {

    let array_msg = [];
    if(message.length>1){
      
      for (let i = 0; i < message.length; i++) {
        const obj = message[i];

        const dict_msg = {
          'offer_asset' : obj.terra_swap?.offer_asset_info?.native_token?.denom,
          'ask_asset' : obj.terra_swap?.ask_asset_info?.native_token?.denom
        };
        array_msg.push(dict_msg);
      }


    }

    return array_msg;
  };




export const parseAttrsMultiple = async (attrs: Attribute[], type: string) => {
  let data = getDefaultAttrs(type);
  const counter = {};
  attrs.map(({ key, value }) => {
    if (data[key]) {
    if(key=="_contract_address"){
      let poolAsset = insightPools(value);
      if(poolAsset!=false)
      {
        
        if(data[key]!=poolAsset.swap_address)
        {
          // If the key already exists, increment the counter for that key
          counter[key] = counter[key] ? counter[key] + 1 : 1;
          // Add the counter to the key name when creating the new property
          data = { ...data, [`${key} ${counter[key]}`]: value };

        }
      }
    }else if (key=="offer_amount" || key=="return_amount" || key=="swap_fee_amount" || key=="protocol_fee_amount"  ){
        // If the key already exists, increment the counter for that key
        counter[key] = counter[key] ? counter[key] + 1 : 1;
        // Add the counter to the key name when creating the new property
        data = { ...data, [`${key} ${counter[key]}`]: value };
    }
    
  }else{
    data = { ...data, [key]: value };
}
    
  });
  return data;
};




export const parseAmountExchanges = async (attrs: Attribute[], type: string) => {
  let data =[];
  attrs.map(({ key, value }) => {
    if (data[key]) return;
    data = { ...data, [key]: value };
  });
};

export const severals_pools_check = async (data: any) => {
  for (const key in data) {
    if (key.startsWith('contract_address ')) {
      return true;
      }
    }
  return false;

}

  export const hasType = (attrs: Attribute[], type: string) => {
    return attrs.find(({ key, value }) => key === "action" && value === type);
  };

  