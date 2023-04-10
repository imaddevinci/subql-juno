// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




export type SwapHistoryProps = Omit<SwapHistory, NonNullable<FunctionPropertyNames<SwapHistory>>>;

export class SwapHistory implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public datetime?: Date;

    public blockHeight?: bigint;

    public txHash?: string;

    public poolId?: string;

    public tokenSpendVolume?: string;

    public tokenSpendUsd?: string;

    public denomSpend?: string;

    public tokenBoughtVolume?: string;

    public tokenBoughtUsd?: string;

    public denomBought?: string;

    public address?: string;

    public swapFeeVolume?: string;

    public swapFeeAsset?: string;

    public pairAddr?: string;

    public lpToken?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save SwapHistory entity without an ID");
        await store.set('SwapHistory', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove SwapHistory entity without an ID");
        await store.remove('SwapHistory', id.toString());
    }

    static async get(id:string): Promise<SwapHistory | undefined>{
        assert((id !== null && id !== undefined), "Cannot get SwapHistory entity without an ID");
        const record = await store.get('SwapHistory', id.toString());
        if (record){
            return this.create(record as SwapHistoryProps);
        }else{
            return;
        }
    }



    static create(record: SwapHistoryProps): SwapHistory {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new this(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
