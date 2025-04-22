import express from 'express';
import uploadFile, { isAuth } from './middleware.js';
import { addAlbum, addSong, addthumbnail, deleteAlbum, deleteSong } from './controller.js';

const router=express.Router()
router.post("/album/new",isAuth,uploadFile, addAlbum)
router.post("/songs/new",isAuth,uploadFile,addSong)
router.post("/songs/:id",isAuth,uploadFile,addthumbnail)
router.delete("/album/:id",isAuth,deleteAlbum)
router.delete("/songs/:id",isAuth,deleteSong)
export default router;
