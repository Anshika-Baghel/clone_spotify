import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config(); // Ensure dotenv is properly invoked

interface IUser {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    playlist: string[];
}

interface AuthenticatedRequest extends Request {
    user?: IUser | null;
}

export const isAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.headers.authorization;
        if (!token || !token.startsWith("Bearer ")) {
            res.status(401).json({
                message: "Unauthorized: Missing or malformed token",
            });
            return;
        }

        // Fetch user data from the USER_SERVICE
        const { data } = await axios.get(`${process.env.USER_URL}/api/v1/user/me`, {
            headers: {
                Authorization: token,
            },
        });

        // Attach the user to the request object
        req.user = data.user;

        // Proceed to the next middleware
        next();
    } catch (error) {
        console.error("Error in isAuth Middleware:", error);
        res.status(403).json({
            message: "Please login",
        });
    }
};

// Multer setup
import multer from "multer";

const storage = multer.memoryStorage();
const uploadFile = multer({ storage: storage }).single("file");
export default uploadFile;