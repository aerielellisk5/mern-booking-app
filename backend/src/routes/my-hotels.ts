import express, { Request, Response } from "express";
import multer from 'multer';
import cloudinary from 'cloudinary';
import Hotel, { HotelType } from "../models/hotel";
import { body } from "express-validator";
import verifyToken from "../middleware/auth";

const router = express.Router();

const storage = multer.memoryStorage();
//telling multer that any photos we get, we want to save them directly in memory

const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 5 * 1024 * 1024 //5MB
    }
})

//api/my-hotels
router.post("/", verifyToken, [
    body("name").notEmpty().withMessage('Name is required'),
    body("city").notEmpty().withMessage('City is required'),
    body("country").notEmpty().withMessage('Country is required'),
    body("description").notEmpty().withMessage('Description is required'),
    body("type").notEmpty().withMessage('Hotel Type is required'),
    body("pricePerNight").notEmpty().isNumeric().withMessage('Price per night is required, and must be a number'),
    body("facility").notEmpty().withMessage('Name is required'),
    body("name").notEmpty().isArray().withMessage('Facilities are required'),
], upload.array("imageFiles", 6), async (req: Request, res:Response) => {
    try {
        const imageFiles = req.files as Express.Multer.File[];
        const newHotel: HotelType = req.body;

        //1. upload images to cloudinary with the SDK.  
        // Needs to be base64
        const uploadPromises = imageFiles.map(async(image)=>{
            const b64 = Buffer.from(image.buffer).toString("base64")
            //need to tell cloudinary what type it is
            let dataURI= "data:" +image.mimetype + ";base64," + b64
            const res = await cloudinary.v2.uploader.upload(dataURI)
            return res.url;
        })

        const imageUrls = await Promise.all(uploadPromises);

        //2. if upload is successful, add the URLS to the new hotel
        newHotel.imageUrls = imageUrls;
        newHotel.lastUpdated = new Date();
        // picking up data from the auth token below
        newHotel.userId = req.userId;
        console.log("made it through creating the image URLs")

        //3. save the new hotel in our database
        console.log("new hotel object")
        // console.log(newHotel)
        const hotel = new Hotel(newHotel)

        await hotel.save();

        //4.return a 201 status
        res.status(201).send(hotel);
        //status 201 just means CREATED rather than successful
    }
    catch (e) {
        // nothing
        // console.log("Error creating hotel: ", e);
        res.status(500).json({message: "Something went wrong"})
    }
})

export default router;