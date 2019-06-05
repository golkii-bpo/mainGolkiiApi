"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tokenHelpers_1 = require("../../helpers/Token/tokenHelpers");
function authToken(req, res, next) {
    const Token = tokenHelpers_1.getTokenFromRequest(req);
    next();
}
exports.authToken = authToken;
