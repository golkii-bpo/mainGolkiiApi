import * as db from 'mongoose';
import * as Fawn from 'fawn';

class Transaction {
    private Inst:any = null;
    private _Task:Fawn.Task;
    constructor(){
        if(!this.Inst){
            Fawn.init(db,'golkii_api');
            this._Task = new Fawn.Task();
            this.Inst = this;
        }
        return this.Inst;
    }
    Task(){
        return this._Task;
    }
}

export default new Transaction;