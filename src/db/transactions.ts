import * as db from 'mongoose';
import * as Fawn from 'fawn';

let Inst:any = null

class Transaction {
    _Task:Fawn.Task;
    constructor(){
        if(!Inst){
            Fawn.init(db,'golkii_api');
            this._Task = new Fawn.Task();
            Inst = this;
        }
        return Inst;
    }
    Task(){
        return this._Task;
    }
}

export default new Transaction;