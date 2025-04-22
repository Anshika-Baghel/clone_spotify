import { sql } from "./config/db.js";
import getBuffer from "./dataUri.js";
import { redisClient } from "./index.js";
import TryCatch from "./TryCatch.js";
import cloudinary from "cloudinary";
import { Request, Response } from "express";

interface AuthenticatedRequset extends Request {
    user?: {
        _id: string;
        role: string;
    };
}

// Configure Cloudinary with environment variables
cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY,
});

export const addAlbum = TryCatch(async (req: AuthenticatedRequset, res: Response) => {

    // Check if the user is an admin
    console.log(req.user)
    if (req.user?.role !== "admin") {
        res.status(401).json({
            message: "Forbidden",
        });
        return;
    }

    const { title, description } = req.body;
    const file = req.file;

    // Check if a file is provided
    if (!file) {
        res.status(400).json({
            message: "Bad Request: Missing file",
        });
        return;
    }

    // Convert the file to a buffer
    const fileBuffer = getBuffer(file);
    if (!fileBuffer || !fileBuffer.content) {
        res.status(500).json({
            message: "Bad Request: Invalid file",
        });
        return;
    }

    const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
        folder: "albums",
    });

    // Insert album details into the database
    const result = await sql`
        INSERT INTO albums (title, description, thumbnail) 
        VALUES (${title}, ${description}, ${cloud.secure_url})
     RETURNING *`;

     if(redisClient.isReady){
        await redisClient.del("albums")
        console.log("Redis cache cleared")
     }

    // Respond with success
    res.status(201).json({
        message: "Album added successfully",
        album: result[0],
    });
});

export const addSong = TryCatch(async (req: AuthenticatedRequset, res: Response) => {
    console.log("User Info:", req.user);
    if (req.user?.role !== "admin") {
        res.status(403).json({
            message: "Forbidden",
        });
        return;
    }
    
    const { title, description, album_id } = req.body;

    console.log(req.body);

    // Check if the album exists
    const isAlbum = await sql`
    SELECT * FROM albums WHERE id=${album_id}
    `;
    if (isAlbum.length === 0) {
        res.status(404).json({
            message: "Album not found",
        });
        return;
    }

    const file = req.file;
    console.log("Uploaded File:", file);

    // Check if a file is provided
    if (!file) {
        res.status(400).json({
            message: "Bad Request: Missing file",
        });
        return;
    }

    // Convert the file to a buffer
    const fileBuffer = getBuffer(file);
    if (!fileBuffer || !fileBuffer.content) {
        res.status(500).json({
            message: "Bad Request: Invalid file",
        });
        return;
    }

    // Upload the file to Cloudinary
    const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
        folder: "songs",
        resource_type: "video",
    });

    console.log("Cloudinary Upload Result:", cloud);

    // Insert song details into the database
    const result = await sql`
    INSERT INTO songs (title, description, audio, album_id)
    VALUES (${title}, ${description}, ${cloud.secure_url}, ${album_id})
    RETURNING *
    `;

    console.log("Inserted Song:", result);

    // Clear and rebuild the Redis cache
    if (redisClient.isReady) {
        await redisClient.del("songs");
        console.log("Redis cache cleared");

        // Rebuild the cache with updated songs
        const updatedSongs = await sql`
        SELECT * FROM songs
        `;
        await redisClient.setEx("songs", 1800, JSON.stringify(updatedSongs));
        console.log("Redis cache updated with new songs");
    }

    res.status(201).json({
        message: "Song added successfully",
        song: result[0],
    });
});


export const addthumbnail = TryCatch(async (req: AuthenticatedRequset, res: Response) => {
    console.log("User Info:", req.user);
    if (req.user?.role !== "admin") {
        res.status(403).json({
            message: "Forbidden",
        });
        return;
    }
    console.log(req.params.id)
    const song = await sql`
    SELECT * FROM songs WHERE id=${req.params.id}
    `;
    if (song.length === 0) {
        res.status(404).json({
            message: "Song not found",
        });
        return;
    }

    const file = req.file;
    console.log("Uploaded File:", file);

    // Check if a file is provided
    if (!file) {
        res.status(400).json({
            message: "Bad Request: Missing file",
        });
        return;
    }

    const fileBuffer = getBuffer(file);
    if (!fileBuffer || !fileBuffer.content) {
        res.status(500).json({
            message: "Bad Request: Invalid file",
        });
        return;
    }

    const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
        folder: "songs",
    });

    console.log("Cloudinary Upload Result:", cloud);

    const result = await sql`
    UPDATE songs SET thumbnail=${cloud.secure_url} WHERE id=${req.params.id} RETURNING *
    `;
    if(redisClient.isReady){
        await redisClient.del("songs")
        console.log("Redis cache cleared")
     
    }

    console.log("Updated Song:", result);

    res.status(201).json({
        message: "Thumbnail added successfully",
        song: result[0],
    });
});

export const deleteAlbum = TryCatch(async (req: AuthenticatedRequset, res: Response) => {
    console.log("User Info:", req.user);
    if (req.user?.role !== "admin") {
        res.status(403).json({
            message: "Forbidden",
        });
        return;
    }

    const { id } = req.params;

    const isAlbum = await sql`
    SELECT * FROM albums WHERE id=${id}
    `;
    if (isAlbum.length === 0) {
        res.status(404).json({
            message: "Album not found",
        });
        return;
    }

    await sql`
    DELETE FROM songs WHERE album_id=${id}
    `;

    if(redisClient.isReady) {
        await redisClient.del("songs")
        console.log("Redis cache cleared")
     
    }
    await sql`
    DELETE FROM albums WHERE id=${id}
    `;
    if(redisClient.isReady) {
        await redisClient.del("albums")
        console.log("Redis cache cleared")
    }

    res.status(200).json({
        message: "Album deleted successfully",
    });
});

export const deleteSong = TryCatch(async (req: AuthenticatedRequset, res: Response) => {
    console.log("User Info:", req.user);
    if (req.user?.role !== "admin") {
        res.status(403).json({
            message: "Forbidden",
        });
        return;
    }

    const { id } = req.params;

    const isSong = await sql`
    SELECT * FROM songs WHERE id=${id}
    `;
    if (isSong.length === 0) {
        res.status(404).json({
            message: "Song not found",
        });
        return;
    }

    await sql`
    DELETE FROM songs WHERE id=${id}
    `;
    if(redisClient.isReady) {
        await redisClient.del("songs")
        console.log("Redis cache cleared")
    }

    res.status(200).json({
        message: "Song deleted successfully",
    });


})
