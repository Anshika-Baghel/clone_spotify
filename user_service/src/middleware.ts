import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User, IUser } from './model.js';

export interface AuthenticatedRequest extends Request {
    user?: IUser | null;
}

export const isAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                message: 'Unauthorized: Missing or malformed token',
            });
            return;
        }

        const token = authHeader.split(' ')[1]; // Extract the token
        if (!token) {
            res.status(401).json({
                message: 'Unauthorized: Token is missing',
            });
            return;
        }

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not defined in the environment variables');
            res.status(500).json({
                message: 'Internal server error',
            });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
        console.log('Decoded Token:', decoded);

        const userId = decoded._id || decoded.id;
        if (!userId) {
            res.status(403).json({
                message: 'Unauthorized: Invalid token payload',
            });
            return;
        }

        console.log('User ID from Token:', userId);

        const user = await User.findById(userId).select('-password');
        console.log('User Found:', user);

        if (!user) {
            res.status(403).json({
                message: 'Unauthorized: User not found',
            });
            return;
        }

        req.user = user; // Attach user to the request object
        next();
    } catch (error) {
        console.error('Error in isAuth Middleware:', error);
        res.status(403).json({
            message: 'Please login',
        });
    }
};