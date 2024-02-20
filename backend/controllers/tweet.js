import { handleError } from "../error.js";
import Tweet from "../models/Tweet.js"
import User from "../models/User.js";
import multer from "multer";
import path from "path";


// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/') // specify the destination directory for uploaded files
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname) // use the original filename for storing the file
//   }
// });


// // Multer upload instance
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 10 * 1024 * 1024 }, // Limit the filesize to 10MB
//   fileFilter: function (req, file, cb) {
//     // Check file type to allow only images
//     if (file.mimetype.startsWith("image/")) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only image files are allowed"));
//     }
//   },
// }).single("image"); // "image" is the name attribute of the file input field in the form

// export const createTweet = async (req, res, next) => {
//   try {
//     // Upload the image first
//     upload(req, res, async function (err) {
//       if (err instanceof multer.MulterError) {
//         // Multer error handling
//         return res.status(400).json({ message: err.message });
//       } else if (err) {
//         // Other errors
//         return res.status(500).json({ message: err.message });
//       }

//       // If no error, image upload was successful
//       // Access the uploaded image file via req.file
//       const { userId, description } = req.body;
//       const image = req.file ? req.file.filename : null; // Get the filename of the uploaded image

//       // Create a new Tweet object with image and description
//       const newTweet = new Tweet({
//         userId,
//         description,
//         image,
//       });

//       // Save the new tweet to the database
//       const savedTweet = await newTweet.save();
//       res.status(200).json(savedTweet);
//     });
//   } catch (error) {
//     // Handle other errors
//     handleError(500, error);
//   }
// };


export const createTweet = async(req,res,next)=>{

    const newTweet = new Tweet(req.body);
    try {
        const savedTweet = await newTweet.save();
        res.status(200).json(savedTweet)
        
    } catch (err) {
        handleError(500,err)
    }
}

export const deleteTweet = async(req,res,next)=>{

    try {
        const tweet = await Tweet.findById(req.params.id)
        if(tweet.userId === req.body.id){
            await tweet.deleteOne();
            res.status(200).json("Tweet has been deleted")
        }
        else{
            handleError(500,err)
        }
    } catch (err) {
        handleError(500,err)

    }
}
// export const deleteTweet = async (req, res, next) => {
//     try {
//       const tweet = await Tweet.findById(req.params.id);
//       if (!tweet) {
//         return handleError(res, 404, 'Tweet not found');
//       }
//       if (tweet.userId.toString() !== req.body.id) {
//         return handleError(res, 403, 'Unauthorized');
//       }
  
//       await tweet.deleteOne();
//       res.status(200).json("Tweet has been deleted");
//     } catch (err) {
//       handleError(res, 500, err.message);
//     }
//   };

export const likeOrDislike = async (req, res, next) => {
    try {
        const tweet = await Tweet.findById(req.params.id);
        const userId = req.body.id;

        if (!tweet) {
            return res.status(404).json({ message: "Tweet not found" });
        }

        const userLikedIndex = tweet.likes.indexOf(userId);
        if (userLikedIndex === -1) {
            // If the user hasn't liked the tweet yet
            await tweet.updateOne({ $push: { likes: userId } });
            res.status(200).json("liked");
        } else {
            // If the user already liked the tweet
            await tweet.updateOne({ $pull: { likes: userId } }); // Remove user's like
            res.status(200).json("disliked");
        }
    } catch (err) {
        handleError(500, err);
    }
};



export const getAllTweets = async(req,res,next)=>{

    try {
       const currentUser = await User.findById(req.params.id);
       const userTweets = await Tweet.find({userId: currentUser._id})
       const followersTweets = await Promise.all(currentUser.following.map((followerId)=>{
        return Tweet.find({userId:followerId})
       }))

       res.status(200).json(userTweets.concat(...followersTweets))
    } catch (err) {
        handleError(500,err)
    }

}


export const getFollowersCount = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const user = await User.findById(userId);
      const followersCount = user.followers.length;
      res.status(200).json({ followersCount });
    } catch (error) {
      res.status(500).json({ message: 'Unable to get followers count', error: error.message });
    }
  };
  
  // Controller function to get the number of users a user is following
  export const getFollowingCount = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const user = await User.findById(userId);
      const followingCount = user.following.length;
      res.status(200).json({ followingCount });
    } catch (error) {
      res.status(500).json({ message: 'Unable to get following count', error: error.message });
    }
  };



export const getUserTweets = async(req,res,next)=>{

    try {
            const userTweets = await Tweet.find({userId: req.params.id}).sort({
                createAt: -1,
            })

       res.status(200).json(userTweets)
    } catch (err) {
        handleError(500,err)
    }

}




export const getExploreTweets = async(req,res,next)=>{

    try {
            const getExploreTweets = await Tweet.find({likes:{$exists:true}}).sort({
                likes: -1,
            })

       res.status(200).json(getExploreTweets)
    } catch (err) {
        handleError(500,err)
    }

}




  