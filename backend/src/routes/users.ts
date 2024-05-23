// Sign Up

import express, {Request, Response} from "express";
import User from "../models/user";
import jwt from "jsonwebtoken"
import { check, validationResult } from "express-validator";


const router = express.Router();

// this route accepts requests from: /api/users/register
router.post("/register", [
    check("firstName", "First Name is required").isString(),
    check("lastName", "Last Name is required").isString(),
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({ min:6 })
], async (req: Request, res:Response)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
    }
    try{
        let user = await User.findOne({
            email: req.body.email,
        })
        if(user) {
            return res.status(400).json({message: "User already exists"})
        }
        user = new User(req.body)
        await user.save();

        const token = jwt.sign(
            {userId: user.id},
            process.env.JWT_SECRET_KEY as string,
            {expiresIn: "1d"}
        );

        res.cookie("auth_token", token, {
            httpOnly: true,
            // http only cookie, can only be accessed on the server
            secure: process.env.NODE_ENV === "production",
            // this is a conditional that says secure true IF it evaluates to true, secure = false if it evaluates to false
            maxAge: 86400000,
            // secure is necessary for production
            // needs to be the same as expiresIn above, but in milliseconds
        });

        return res.status(200).send({ message: `"User registered OK, token = ${token}"`});
        // return res.status(200).send({ message: "User registered OK"});

    } catch (error) {
        console.log(error)
        // log the error on the backend because the error may contain sensitive info from mongo db
        res.status(500).send({message: "Something went wrong"})
    }
});

export default router;