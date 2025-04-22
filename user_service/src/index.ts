import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './route.js';
import cors from 'cors';


dotenv.config();
const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string, {
           dbName: 'Spotify',
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}
    

const app= express();
app.use(cors({
    origin: 'https://spotify-clone-orcin-seven.vercel.app', // Allow requests from your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true, // Allow cookies and credentials
}));
app.use(express.json());

app.use("/api/v1",userRoutes);

const port=process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('User Service is running!');
});
app.listen(5000, () => {
    connectDb();
    console.log('Server is running on port 5000');
   
});