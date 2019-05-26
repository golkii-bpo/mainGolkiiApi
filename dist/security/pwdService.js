"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt");
const Salt = 10;
class PwdService {
    encrypPwd(password) {
        const pwdSalt = bcrypt.genSaltSync(10), pwdCrypted = bcrypt.hashSync(password, pwdSalt);
        return pwdCrypted;
    }
    comparePwdHashed(NewPwd, OldPwd) {
        return bcrypt.compareSync(NewPwd, OldPwd);
    }
    comparePwd(NewPwd, OldPwd) {
        return OldPwd == NewPwd;
    }
}
exports.default = new PwdService;
