import jwt from "jsonwebtoken";
import { User } from "../models/users.model.js";


const protect = async (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        // extract token
        const token = authHeader.split(" ")[1];

        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user to request 
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({
                message: "User not found",
            });
        }

        next();
    }catch(error){
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

export default protect;