import { sql } from "./config/db.js";
import TryCatch from "./TryCatch.js";
import {redisClient}from './index.js'
export const getAllAlbum = TryCatch(async (req, res) => {
    let albums;

    const CACHE_EXPIRY = 1800; // 30 minutes in seconds
    if (redisClient.isReady) {
        albums = await redisClient.get("albums");
    }

    if (albums) {
        console.log("Cache hit");
        res.status(200).json({
            message: "Albums fetched successfully",
            albums: JSON.parse(albums),
        });
        return; // Prevent further execution
    }

    console.log("Cache miss");
    albums = await sql`
    SELECT * FROM albums
    `;
    await redisClient.setEx("albums", CACHE_EXPIRY, JSON.stringify(albums));

    res.status(200).json({
        message: "Albums fetched successfully",
        albums,
    });
});

export const getAllSongs=TryCatch(async (req, res) => {
    let songs;

    
    const CACHE_EXPIRY = 1800; // 30 minutes in seconds
    if (redisClient.isReady) {
        songs = await redisClient.get("songs");
    }

    if (songs) {
        console.log("Cache hit");
        res.status(200).json({
            message: "Songs fetched successfully",
            albums: JSON.parse(songs),
        });
        return; // Prevent further execution
    }
    console.log("Cache miss");
    songs = await sql`
    SELECT * FROM songs
    `;
    await redisClient.setEx("songs", CACHE_EXPIRY, JSON.stringify(songs));

    res.status(200).json({
        message: "songs fetched successfully",
        songs,
    });

})

export const getAllSongsOfAlbum=TryCatch(async (req, res) => {
 const { id } = req.params;
 const CACHE_EXPIRY = 1800; 
 // 30 minutes in seconds
 let songs;
 let albums;
 if(redisClient.isReady){

    const cacheKey=`album:${id}`
    const cachedData=await redisClient.get(cacheKey)
    if(cachedData){
        console.log("Cache hit")
        res.status(200).json({
            message:"Album fetched successfully",
            response:JSON.parse(cachedData),
        })
        return;
    }
    console.log("Cache miss")
 }

    albums=await sql`
    SELECT * FROM albums WHERE id=${id}`
    if(albums.length===0){
        res.status(404).json({
            message:"Album not found",
        })
        return;
    }
    songs=await sql`
    SELECT * FROM songs WHERE album_id=${id}`
    if(songs.length===0){
        res.status(404).json({
            message:"No songs found in this album",
        })
        return;
    }
    const response={songs,albums:albums[0]}
    if(redisClient.isReady){

        await redisClient.setEx(`album:${id}`,CACHE_EXPIRY,JSON.stringify(response))
        console.log("Data cached")
    }
        res.status(200).json({
        message: "Songs fetched successfully",
        response,
    
})

})

export const getSingleSong=TryCatch(async (req, res) => {

    const { id } = req.params;
    let songs;
    songs=await sql`
    SELECT * FROM songs WHERE id=${id}`
    if(songs.length===0){
        res.status(404).json({
            message:"Song not found",
        })
        return;
    }
    res.status(200).json({
        message: "Song fetched successfully",
        songs:songs[0],
})
})