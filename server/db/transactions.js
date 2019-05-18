const
    db = require('mongoose'),
    Fawn = require('fawn');
let 
    Inst = null;

class Transaction { 
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

module.exports = new Transaction;