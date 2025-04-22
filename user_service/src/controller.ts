import { Request, Response } from 'express';
import TryCatch from './TryCatch.js';
import { User } from './model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from './middleware.js';

export const registerUser = TryCatch(async (req, res) => {
    const { name, email, password } = req.body;

    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
        res.status(400).json({
            message: 'User already exists',
        });
        return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
        expiresIn: '7d',
    });

    // Send the response
    res.status(201).json({
        message: 'User registered successfully',
        user: {
            name,
            email,
        },
        token,
    });
});


export const loginUser = TryCatch(async (req, res) => {
   const { email, password } = req.body;
     const user=await User.findOne({email});
     if(!user){
        res.status(400).json({
            message:"User not found",

        });
        return;
     }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            res.status(404).json({
                message:"Invalid credentials",
            });
            return;
        }
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET as string,{expiresIn:"7d"});
        res.status(200).json({
            message:"Login successful",
            user:{
                name:user.name,
                email:user.email,
            },
            token,
        


})


});


export const myProfile= TryCatch(async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;
    console.log("getty user "+user)
    if (!user) {
        res.status(404).json({
            message: 'User not found',
        });
        return;
    }
    console.log("fetched yela")
    res.status(200).json({
        message: 'User profile fetched successfully',
        user: {
            name: user.name,
            email: user.email,
            role: user.role,
            playlist:user.playlist
            
        
        },
    });

})

export const AddToPlayList = TryCatch(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?._id;
    const user = await User.findById(userId);
    if (!user) {
        res.status(404).json({
            message: "User not found",
        });
        return;
    }

    // Add logic for adding to playlist here
    if (user?.playlist.includes(req.params.id)) {
        const index = user.playlist.indexOf(req.params.id);
        user.playlist.splice(index, 1);
        await user.save();
        res.status(200).json({
            message: "Removed from playlist",
        });
        return;
    }
    
    user.playlist.push(req.params.id);
    await user.save();
    res.status(200).json({
        message: "Added to playlist",
    });
});
