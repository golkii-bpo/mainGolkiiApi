import {Request,Response,NextFunction} from 'express';
import * as JWT from 'jsonwebtoken';
import {SettingsToken as authCong} from '../../settings/settings';
import ColMdl from '../../models/colaboradores/general/colaborador.model';
import {getTokenFromRequest} from '../../helpers/Token/tokenHelpers';

export function authToken(req:Request,res:Response,next:NextFunction) {
    const Token = getTokenFromRequest(req);

    

    next();
}