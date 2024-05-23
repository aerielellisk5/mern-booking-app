// Login
import { check, validationResult } from "express-validator";
import express, {Request, Response} from "express";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth";

const router = express.Router();

router.post("/login", [
    check("email", "Email is required").isEmail(),
    check("password", "Pass with 6 or more characters required").isLength({ min: 6,})
],
async(req: Request, res: Response) =>{
    const errors = validationResult(req)
    if(!errors.isEmpty) {
        return res.status(400).json( {message: errors.array() })
    }

    const {email, password} = req.body;
    
    try {
        const user = await User.findOne({ email })
        if(!user){
            return res.status(400).json({ message: "Invalid Credentials"});
        }

        const isMatch = await bcrypt.compare(password, user.password)
        // isMatch will be true or false

        if(!isMatch){
            return res.status(400).json({ message: "Invalid Credentials"});
        }

        // create an access token and return it as a part of an http cookie
        const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET_KEY as string, {
            expiresIn: "1d"
        })
        // since we created a token in both here and in the users route, technically that could be its own function.  Maybe something to look into later

        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000,
        });
        res.status(200).json({userId: user._id})
    }
    catch (error){
        console.log(error);
        res.status(500).json({message: "Something went wrong"})
        // return 500 error which is a server error
    }
});


router.get("/validate-token", verifyToken, (req: Request, res: Response)=> {
    res.status(200).send({ userId: req.userId });
});

router.post("/logout", (req: Request, res: Response) => {
    res.cookie("auth_token", "", {
        expires: new Date(0)
        // expires at time of creation; invalid token
    })
    res.send();
})

export default router;