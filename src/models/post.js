import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
    createdAt:{
        type: String,
    },
    userId:{
        type: String,
        ref:"User",
        required:true
    },
    title:{
        type: String,
    },
    content:{
        type: String,

    },

    isPublic:{
        type: Boolean,
        default: true
    }
},
{timestamps :true}
)
const PostModel = mongoose.model("Post",postSchema)

export default PostModel;