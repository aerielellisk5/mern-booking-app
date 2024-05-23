import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            userId: string;
        }
    }
}

const verifyToken = (req: Request, res:Response, next: NextFunction) => {
    const token = req.cookies['auth_token'];
    if (!token) {
        return res.status(401).json({message: `"unauthorized - no token at all and token is this: ${token}"`});
        // 401 is unauthorized
    }
// const verifyToken = (req: Request, res: Response, next: NextFunction) => {
//     const token = req.cookies["auth_token"];
//     if (!token) {
//       return res.status(401).json({ message: "unauthorized" });
//     }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
        req.userId = (decoded as JwtPayload).userId;
        next();
    }
    catch(error){
        return res.status(401).json({message: "unauthorized - not a valid token"});
    }
};

export default verifyToken;