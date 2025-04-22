import express from 'express';
import dotenv from 'dotenv';
import songRoutes from './route.js'
import redis from 'redis'
import cors from 'cors'
dotenv.config()
export const redisClient=redis.createClient({
  password:process.env.REDIS_PASSWORD,
    socket:{
        host:process.env.REDIS_HOST,
        port:process.env.REDIS_PORT?parseInt(process.env.REDIS_PORT):13465
    }

})

redisClient.connect().then(()=>console.log("connected to redisclient")).catch((err)=>console.log(err))
const app=express()
app.use(cors())
const port=process.env.PORT || 5002
app.use("/api/v1",songRoutes)

app.listen(port,()=>{
    console.log(`Song service is running on port ${port}`);
})

