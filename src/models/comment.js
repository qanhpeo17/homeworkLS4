import mongoose from "mongoose";
const commentSchema = new mongoose.Schema({
    
    userId:{
        type: String,
        ref:"User",
        required:true
    },createdAt:{
        type: String,
    },
    postId:{
        type:String,
        ref:"Post",
        required:true
    },
    
    content:{
        type: String,
    }
},
{timestamps :true}
)
const CommentModel = mongoose.model("Comment",commentSchema)

export default CommentModel;