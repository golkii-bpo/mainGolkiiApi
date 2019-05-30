"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db = require("mongoose");
const Fawn = require("fawn");
class Transaction {
    constructor() {
        this.Inst = null;
        if (!this.Inst) {
            Fawn.init(db, 'golkii_api');
            this._Task = new Fawn.Task();
            this.Inst = this;
        }
        return this.Inst;
    }
    Task() {
        return this._Task;
    }
}
exports.default = new Transaction;
