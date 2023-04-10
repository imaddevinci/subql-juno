import { CosmosEvent } from "@subql/types-cosmos";
import { num } from "../../lib/num";
import {
  TradingHist,
} from "../../types";
import { TradingHistEntity } from "../../config/type";




/**
 * Save trading history
 */
export const saveHistory = async (
  data: TradingHistEntity,
  event: CosmosEvent
) => {
  const messageRecord = new TradingHist(
    `${event.tx.hash}-${event.msg.idx}-${data.id}`
  );
  messageRecord.address = data.address;
  messageRecord.blockHeight = data.blockHeight;
  messageRecord.token = data.token;
  messageRecord.secondToken = data.secondToken;
  messageRecord.pairAddr = data.pair;
  messageRecord.baseVolume = data.return_amount;
  messageRecord.targetVolume = data.offer_amount;
  messageRecord.price = data.price;
  messageRecord.datetime = data.datetime;
  messageRecord.txType = data.txType;
  messageRecord.lpToken = data.lpToken;
  messageRecord.swapFeeAsset = data.swap_fee_asset;
  messageRecord.swapFeeVolume = data.swap_fee_amount;
  messageRecord.txHash = data.txHash;
  
  await messageRecord.save();
};
