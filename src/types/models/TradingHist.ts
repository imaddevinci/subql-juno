// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';



import {
    TxType,
} from '../enums'


export type TradingHistProps = Omit<TradingHist, NonNullable<FunctionPropertyNames<TradingHist>>>;

export class TradingHist implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public txHash?: string;

    public blockHeight?: bigint;

    public datetime?: Date;

    public address?: string;

    public token?: string;

    public secondToken?: string;

    public pairAddr?: string;

    public lpToken?: string;

    public price?: string;

    public baseVolume?: string;

    public targetVolume?: string;

    public txType?: TxType;

    public swapFeeVolume?: string;

    public swapFeeAsset?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save TradingHist entity without an ID");
        await store.set('TradingHist', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove TradingHist entity without an ID");
        await store.remove('TradingHist', id.toString());
    }

    static async get(id:string): Promise<TradingHist | undefined>{
        assert((id !== null && id !== undefined), "Cannot get TradingHist entity without an ID");
        const record = await store.get('TradingHist', id.toString());
        if (record){
            return this.create(record as TradingHistProps);
        }else{
            return;
        }
    }



    static create(record: TradingHistProps): TradingHist {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new this(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
