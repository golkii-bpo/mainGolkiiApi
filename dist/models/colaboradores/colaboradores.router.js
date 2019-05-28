"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const colaborador_routes_1 = require("./general/colaborador.routes");
const user_routes_1 = require("./usuarios/user.routes");
const colaboradorRouter = express.Router();
exports.colaboradorRouter = colaboradorRouter;
colaboradorRouter.use('/general', colaborador_routes_1.colaboradorRouter);
colaboradorRouter.use('/user', user_routes_1.userRouter);
