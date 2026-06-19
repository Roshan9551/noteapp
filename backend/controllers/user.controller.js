import bcrypt from "bcryptjs";
import { User } from "../models/users.model.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import generateToken from "../utils/generateToken.js";

export const signup = async (req, res) => {
    try{
        const { name, email, password } = req.body;

        // validate input
        if(!name || !email || !password){
            return res.status(400).json({ message: "All fields are required" });
        }

        // check if user already exists
        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(400).json({ message: "User already exists" });
        }

        // hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // upload image to cloudinary 
        let profilePic = "";

        if(req.file){
            const result = await uploadToCloudinary(req.file.buffer);
            profilePic = result.secure_url;
        }

        // create user in db
        const user = await User.create({
            name, 
            email,
            password: hashedPassword,
            profilePic
        });

        // generate jwt token
        const token = generateToken(user._id);

        // send response
        res.status(201).json({
            message: "User create successfully",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                profilePic: user.profilePic
            }
        });
    }catch(error){
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}