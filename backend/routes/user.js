import express from 'express';
import {getUser, update, deleteUser,follow, unfollow } from "../controllers/users.js"
import { verifyToken } from '../verifytoken.js';
const router = express.Router();


//update user
router.put('/:id',verifyToken, update)


//Get User
router.get('/find/:id', getUser);

//DElete User
router.delete("/:id",verifyToken, deleteUser)


//follow
router.put('/follow/:id', verifyToken, follow)

//unfollow
router.put('/unfollow/:id', verifyToken, unfollow)

export default router;