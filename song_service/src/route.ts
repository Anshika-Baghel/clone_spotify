import express from 'express';
import { getAllAlbum, getAllSongs, getAllSongsOfAlbum, getSingleSong } from './controller.js';
const router=express.Router();

router.get("/album/all",getAllAlbum)
router.get("/songs/all",getAllSongs)
router.get("/album/:id",getAllSongsOfAlbum)
router.get("/songs/:id",getSingleSong)
export default router;