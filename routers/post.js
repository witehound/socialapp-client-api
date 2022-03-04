const router = require('express').Router()
const { updateOne } = require('../models/postModels')
const post = require('../models/postModels')
const user = require('../models/userModels')

//craete a post
router.post('/',async (req,res)=>{
    try {
         const createdPost = await  new post(req.body)
         await createdPost.save()
         res.json(createdPost)
    } catch (error) {
        res.json({message: 'error at catch'})
    }
   
})
//update a post
router.put('/:id',async (req,res)=>{
    try {
        const Post = await post.findById(req.params.id)
       if(Post.userId === req.body.userId){
           await Post.updateOne({$set: req.body})
           res.json({message:'this post ahs been updated'})
       }else{
           res.json({message:'you cant uodate this post'})
       }
    } 
    catch (error) {
        res.json({message:'failed at init'})
    }
})
//delete a post
router.delete('/:id',async (req,res)=>{
    try {
        const Post = await post.findById(req.params.id)
       if(Post.userId === req.body.userId){
           await Post.deleteOne()
           res.json({message:'this post has been delted'})
       }else{
           res.json({message:'you can only delte your post'})
       }
    }
    catch (error) {
        res.json({message:'failed at init'})
    }
})
//like,dislike a post
router.put('/:id/like',async (req,res)=>{
    try {
       const Post = await post.findById(req.params.id)
       if(!Post.likes.includes(req.body.userId)){
           await Post.updateOne({$push: {likes: req.body.userId}})
           res.json({message:'you just liked this post '})
       }else{
           await Post.updateOne({$pull: {likes: req.body.userId}})
           res.json({message:'you just unliked this post'})
       }
    }
    catch (error) {
        res.json({message:'failed at init'})
    }
})


//get time line post
router.get('/timeline', async (req,res)=>{
    try {
        const currentUser = await user.findById(req.body.userId)
        console.log(currentUser)
        const timeLine = await post.find({userId:currentUser._id})
        console.log(timeLine)
        const findPosts = await Promise.all(
            currentUser.followings.map((freiendId)=>{
                post.findById(freiendId)
            })
        )
        console.log(findPosts)
        res.json(timeLine.concat(...findPosts))
    } catch (error) {
        res.json({message:'failed at init'})
    }
})

//get a post
router.get('/:id',async (req,res)=>{
    try {
       const Post = await post.findById(req.params.id)
       res.json(Post)
    }
    catch (error) {
        res.json({message:'failed at init'})
    }
}
)

module.exports = router