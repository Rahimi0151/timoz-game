import * as yup from 'yup';
import config from 'config';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { Request, Response, NextFunction } from 'express';
import CustomRequest from '../../utils/customRequest';
declare namespace Express {
    export interface Request {
       user?: string | JwtPayload
    }
 }
const create = (req: CustomRequest, res: Response, next: NextFunction)=>{
    const userSchema = yup.object({
        email: yup.string().max(255).email().required('email required'),
        password: yup.string().min(8).max(255).required('password required'),
    });
    
    userSchema.validate(req.body)
        .then(() => {next();})
        .catch((error)=>{res.status(400).json({message: error.message})})
}

const isLogin = (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req.headers['x-auth-token']) return res.status(401).json({message: "login required: no key"})

    const token: string = <string>req.headers['x-auth-token'];
    const secretKey: string = <string>config.get('jwt-secret-key');
    
    try {
        const decodedToken = jwt.verify(token, secretKey) as JwtPayload;
        req.user = decodedToken;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'login required' });
    }
}

const isSeyyed = (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req.headers['x-auth-token']) return res.status(401).json({message: "login required: no key"})

    const token = <string>req.headers['x-auth-token'];
    const secretKey = <string>config.get('jwt-secret-key');
    try {
        const decodedToken = jwt.verify(token, secretKey) as string | JwtPayload;
        if (typeof decodedToken === 'string') {return res.status(500).json({ message: 'Internal server error' });}
        if (decodedToken.role !== 'seyyed') {return res.status(403).json({ message: 'you need to be seyyed!' });}

        req.user = decodedToken;
        next();
    } catch (err) {return res.status(401).json({ message: 'login required' });}
}

export { create, isLogin, isSeyyed };