// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




export type ExecuteEventProps = Omit<ExecuteEvent, NonNullable<FunctionPropertyNames<ExecuteEvent>>>;

export class ExecuteEvent implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public blockHeight: bigint;

    public txHash: string;

    public contractAddress: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save ExecuteEvent entity without an ID");
        await store.set('ExecuteEvent', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove ExecuteEvent entity without an ID");
        await store.remove('ExecuteEvent', id.toString());
    }

    static async get(id:string): Promise<ExecuteEvent | undefined>{
        assert((id !== null && id !== undefined), "Cannot get ExecuteEvent entity without an ID");
        const record = await store.get('ExecuteEvent', id.toString());
        if (record){
            return this.create(record as ExecuteEventProps);
        }else{
            return;
        }
    }



    static create(record: ExecuteEventProps): ExecuteEvent {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new this(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
