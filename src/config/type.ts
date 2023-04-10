import { TxType } from "../types";

export type TradingHistEntity = {
    id: number;
    address:string;
    blockHeight: bigint;
    token: string;
    secondToken: string;
    pair_addr: string;
    base_volume: string;
    target_volume: string;
    price: string;
    datetime: Date;
    lpToken: string;
    return_amount: string;
    offer_amount: string;
    swap_fee_amount: string;
    swap_fee_asset: string;
    pair: string;
    txType: TxType;
    txHash:string;
  };


export type SwapHistory = {
    id: number;
    datetime: Date;
    blockHeight: bigint;
    txHash: string;
    poolId: string;
    tokenSpendVolume: bigint;
    tokenSpendUsd: bigint;
    denomSpend: string;
    tokenBoughtVolume: bigint
    tokenBoughtUsd: bigint
    denomBought: string
    address: string;
    swapFeeVolume: bigint;
    swapFeeAsset: bigint;
  
  }



  