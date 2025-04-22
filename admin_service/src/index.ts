import express from 'express';
import dotenv from 'dotenv';
import {sql} from './config/db.js';
import adminRoutes from './routes.js';
import cloudinary from 'cloudinary';
import redis from 'redis';
import cors from 'cors';

dotenv.config();


export const redisClient=redis.createClient({
    password:process.env.REDIS_PASSWORD,
      socket:{
          host:process.env.REDIS_HOST,
          port:process.env.REDIS_PORT?parseInt(process.env.REDIS_PORT):13465
      }
  })
  
  redisClient.connect().then(()=>console.log("connected to redisclient")).catch((err)=>console.log(err))


cloudinary.v2.config({
 cloud_name: process.env.CLOUD_NAME,
api_key: process.env.CLOUD_API_KEY,
api_secret: process.env.CLOUD_SECRET_KEY,

});


const port=process.env.PORT || 5001;
const app = express();
app.use(cors())
async function initDB(){
    try {
        await sql`
        CREATE TABLE IF NOT EXISTS albums(
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description VARCHAR(255) NOT NULL,
            thumbnail VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT NOW())
        `;

        await sql`
        CREATE TABLE IF NOT EXISTS songs(
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description VARCHAR(255) NOT NULL,
            thumbnail VARCHAR(255) ,
            audio VARCHAR(255) NOT NULL,
            album_id INTEGER REFERENCES albums(id) ON DELETE SET NULL,
            created_at TIMESTAMP DEFAULT NOW()
        )
        `;
        console.log('Database initialized successfully');
        
    } catch (error) {
        console.error('Error initializing database:', error);
        
    }
}
initDB().then(()=>{
    console.log('Database initialized successfully');
})
app.use(express.json())
app.use("/api/v1",adminRoutes)
app.listen(5001,()=>{
    console.log(`Admin service is running on port${port} `);
})