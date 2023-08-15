import yup from 'yup';
import config from 'config';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { Request, Response, NextFunction } from 'express';

const create = (req: Request, res: Response, next: NextFunction)=>{
    const userSchema = yup.object({
        email: yup.string().max(255).email().required('email required'),
        password: yup.string().min(8).max(255).required('password required'),
    });
    
    userSchema.validate(req.body)
        .then(() => {next();})
        .catch((error)=>{res.status(400).json({message: error.message})})
}

const isLogin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers['x-auth-token']) return res.status(401).json({message: "login required: no key"})

    const token: string = <string>req.headers['x-auth-token'];
    const secretKey: string = <string>config.get('jwt-secret-key');
    
    // Verify the JWT token
    jwt.verify(token, secretKey, (err, decodedToken) => {
        if (err) {return res.status(401).json({message: "login required"})}
        req.user = decodedToken!
        next()
    });
}

const isSeyyed = (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers['x-auth-token']) return res.status(401).json({message: "login required: no key"})

    const token = <string>req.headers['x-auth-token'];
    const secretKey = <string>config.get('jwt-secret-key');

    jwt.verify(token, secretKey, (err, decodedToken) => {
        if (err) {return res.status(401).json({ message: "login required" });}
        if (typeof decodedToken === 'string') {return res.status(500).json({ message: "Internal server error" });}
        if (decodedToken!.role !== "seyyed") {return res.status(403).json({ message: "you need to be seyyed!" });}
        
        req.user = decodedToken!;        
        next()
      });
}

export { create, isLogin, isSeyyed };