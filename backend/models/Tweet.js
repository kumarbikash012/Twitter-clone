import mongoose from "mongoose";

const TweetSchema = new mongoose.Schema({
    userId:{
        type:String,
        required: true
    },
    description:{
        type:String,
        required: true,
        max:300
    },
    likes:{
        type: Array,
        default:[]
    },
    image: {
        data: Buffer, // Buffer to store binary data of the picture
        contentType: String // MIME type of the picture
    }
},{timestamps:true});

export default mongoose.model("Tweet", TweetSchema)