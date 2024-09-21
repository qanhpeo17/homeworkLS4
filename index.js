//
import express from 'express'
import connectDatabase from './src/database/db.js'
import cors from 'cors'
import UserModel from './src/models/user.js'
import PostModel from './src/models/post.js'
import CommentModel from './src/models/comment.js'
connectDatabase()


//
const app = express()
const PORT = 3003
//define middleware
app.use(cors())
app.use(express.json())
//define router
app.get('/',(req,res)=>{
    res.status(200).json({
        Message:"success"
    })
})
//GET ALL INFOS
app.get('/User', async (req,res)=>{
    try {
        const users = await UserModel.find()
        res.status(200).json({
            Message:"success",
            users
        })
    } catch (error) {
        res.status(500).send({
            Message: error.Message
        })
    }
})
app.get('/Post', async (req,res)=>{
    try {
        const posts = await PostModel.find()
        res.status(200).json({
            Message:"success",
            data: posts
        })
    } catch (error) {
        res.status(500).send({
            Message: error.Message
        })
    }
})
//bai1
app.post('/register',async (req,res)=>{
    try {
        const {email,password} = req.body;
        if(!email||!password){
            throw new Error("Email and password are required!")
        }

        const newUser = {
            email,password,
        }
        const user = new UserModel(newUser)
        await user.save();

        res.status(201).json({
            Message:"User created successfully",user
        })
    } catch (error) {
        res.status(400).json({
            Message: error.Message
        })
    }
})
//bai2
app.post('/create-post',async (req,res)=>{
    try {
        const {userId,title,content,isPublic} = req.body
        if(!userId||!title||!content||!isPublic){
            res.status(404).json({
                Message:"Thieu thong tin"
            })
        }
        const userAuth = await UserModel.findById(userId)
        if(!userAuth){
            res.status(404).json({
                Message:"Nguoi dung khong ton tai"
            })
        }
        const newPost = {
            userId,title,content,isPublic
        }
        const post = new PostModel(newPost)
        await post.save();

        res.status(201).json({
            Message:"Post created successfully",post
        })
    } catch (error) {
        res.status(400).json({
            Message: error.Message
        })
    }
})
//bai3
app.put('/post-edit', async(req,res)=>{
    try {
        const {userId,postId,title,content,isPublic} = req.body
        if(!userId||!postId||!title||!content||!isPublic){
            res.status(404).json({
                Message:"Thieu thong tin"
            })
        }
        const userAuth = await UserModel.findById(userId)
        if(!userAuth){
            res.status(404).json({
                Message:"nguoi dung khogn ton tai"
            })
        }
        const postExists =await PostModel.findById(postId)
        if(!postExists){
            res.status(404).json({
                Message:"bai viet khong ton tai"
            })
        }else{
            const postEdited = {
                title,content,isPublic
            }
            const postAfterEdit = await PostModel.findByIdAndUpdate(postId, postEdited, { new: true });

            res.status(201).json({
                Message:"Bai viet duoc chinh sua thanh cong!",postAfterEdit
            })
        }
    } catch (error) {
        res.status(500).json({
            Message:error.Message
        })
    }
})
//bai4
app.post('/add-comment',async (req,res)=>{
    try {
        const {postId,userId,content} = req.body
        if(!postId||!userId||!content){
            res.status(404).json({
                Message:"Thieu thong tin"
            })
        }
        const userExists = await UserModel.findById(userId)
        const postExists = await PostModel.findById(postId)
        if(!userExists){
            res.status(404).json({
                Message:"Nguoi dung khong ton tai"
            })
        }
        if(!postExists){
            res.status(404).json({
                Message:"Bai viet khong ton tai"
            })
        }
        const newComment = {
            postId, userId, content
        }
        const comment = new CommentModel(newComment)
        await comment.save()

        res.status(201).json({
            Message:"Binh luan duoc dang thanh cong!",comment
        })

    } catch (error) {
        res.status(400).json({
            Message:error.Message
        })
    }
})
//bai 5
app.put('/edit-comment', async (req, res) => {
    try {
        const { cmtId, userId, content } = req.body;

        if (!cmtId || !userId || !content) {
            return res.status(400).json({
                Message: "Thiếu thông tin",
                data: null
            });
        }

        const cmtExists = await CommentModel.findById(cmtId);
        if (!cmtExists) {
            return res.status(404).json({
                Message: "Bình luận không tồn tại",
                data: null
            });
        }

        if (cmtExists.userId.toString() !== userId) {
            return res.status(403).json({
                Message: "Bạn không có quyền chỉnh sửa bình luận này",
                data: null
            });
        }

        const commentEdited = { content };
        const commentAfterEdit = await CommentModel.findByIdAndUpdate(cmtId, commentEdited, { new: true });

        return res.status(200).json({
            Message: "Bình luận được chỉnh sửa thành công!",
            commentAfterEdit
        });

    } catch (error) {
        return res.status(500).json({
            Message: error.message
        });
    }
});
//bai 6 va 8
app.get('/post/comments', async (req, res) => {
    try {
        const { postId } = req.query;  

        if (!postId) {
            return res.status(400).json({
                Message: "Thiếu thông tin postId"
            });
        }

        const comments = await CommentModel.find({ postId });

        if (comments.length === 0) {
            return res.status(404).json({
                Message: "Bài viết này không có bình luận"
            });
        }

        return res.status(200).json({
            Message: "Thành công",
            comments
        });

    } catch (error) {
        return res.status(400).json({
            Message: error.message
        });
    }
});

//bai 7
app.get('/posts-with-comments', async (req, res) => {
    try {
        const posts = await PostModel.find();
        const comments = await CommentModel.find();
        const postsWithComments = posts.map(post => {
            const threeComments = comments.filter(comment => comment.postId === post._id.toString()).slice(0, 3);
        
            return {
                post,
                comments: threeComments.length > 0 ? threeComments : "Khong co binh luan"
            };
        });
        

        return res.status(200).json({
            Message: "Thành công",
            posts: postsWithComments
        });
        
    } catch (error) {
        return res.status(400).json({
            Message: error.message
        });
    }
});


//handle error

//run server
app.listen(PORT,()=>{
    console.log(`server is running on http://localhost:${PORT}`)
})