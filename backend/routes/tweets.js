import express from "express";
import { verifyToken } from "../verifytoken.js";
import { createTweet,deleteTweet,likeOrDislike,getFollowingCount,getAllTweets,getUserTweets,getExploreTweets,getFollowersCount} from "../controllers/tweet.js";

const router = express.Router()

// Create a tweet
router.post('/', verifyToken,  createTweet)

router.get('/followers/:userId', getFollowersCount);

router.get('/following/:userId', getFollowingCount);

//Delete a tweet
router.delete('/:id', verifyToken, deleteTweet)

//Like or dislike a tweet
router.put('/:id/like', likeOrDislike)

// get all timeline tweet
router.get('/timeline/:id', getAllTweets)

//get user tweet only
router.get('/user/all/:id', getUserTweets)

//explore
router.get('/explore', getExploreTweets)


// POST request to resend a tweet
router.post('/resend/:tweetId', async (req, res) => {
    const tweetId = req.params.tweetId;
  
    try {
      // Find the tweet in the database by its ID
      const tweet = await Tweet.findById(tweetId);
  
      if (!tweet) {
        return res.status(404).json({ message: 'Tweet not found' });
      }
  
      // Resend the tweet logic (you can define your own logic here)
      // For example, you might want to update the updatedAt field to the current time
  
      tweet.updatedAt = new Date();
      await tweet.save();
  
      res.status(200).json({ message: 'Tweet resent successfully', tweet });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });


export default router;