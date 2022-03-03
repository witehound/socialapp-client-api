const router = require("express").Router()
const user = require("../models/userModels")
const bcrypt = require("bcrypt")

//update user
router.put("/:id", async (req,res)=>{
    if(req.body._id === req.params.id || req.body.isAdmin){
        if(req.body.password){
            try {
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(req.body.password,salt)
            } catch (error) {
                res.json({message:""})
            }
        }
        try {
            const User = await user.findByIdAndUpdate(req.body._id, {$set: req.body})
            try {
                const updatedUser = await User
                res.json({message:"account has been uopdated"})
            } catch (error) {
                res.status(404).json({message:"update error"})
            }
        } catch (error) {
            res.json({error})
        }
    }else{
        res.status(404).json("you can only update your profile")
    }
})

//delete user
router.delete("/:id", async (req,res)=>{
    if(req.body._id === req.params.id || req.body.isAdmin){
        try {
            const User = await user.deleteOne(req.body.id)
            res.status(404).json({message:"account has been deleted succesfully"}) 
        } catch (error) {
            res.json({error})
        }
    }else{
        res.status(404).json("you can only delete your profile")
    }
})

//get user
router.get("/:_id", async (req,res)=>{
    const findUser = await user.findById(req.params._id)
    const {password,createdAt,updatedAt,__v, ...other} = findUser._doc
    if (req.body._id === req.params.id){
        try {
            res.json(other)
        } catch (error) {
            res.status(404).json("user cannot be found")
        }
    }
})
//follow a user
router.put('/:id/follow', async (req,res)=>{
    if(req.body._id !== req.params.id){
        try {
            const toFollowUser = await user.findById(req.params.id)
            const User = await user.findById(req.body._id)
           if(!toFollowUser.followers.includes(req.body._id)){
               await toFollowUser.updateOne({$push: {followers: req.body._id }})
               await User.updateOne({$push: {following: req.params.id}})
               res.json({message:`you have succesfully followed ${toFollowUser.username}`})
           }else{
               res.json({message:`you already follow ${toFollowUser.username}`})
           }
        } catch (error) {
            res.status(404).json({message:"stopped working"})
        }
    }else{
        res.status(403).json({message:'you cant follow yourself'})
    }
})

//unfollow a user
router.put('/:id/unfollow', async (req,res)=>{
    if(req.body._id !== req.params.id){
        try {
            const unFollowUser = await user.findById(req.params.id)
            const User = await user.findById(req.body._id)
           if(unFollowUser.followers.includes(req.body._id)){
               await unFollowUser.updateOne({$pull: {followers: req.body._id}})
               await User.updateOne({$pull: {following: req.params.id}})
               res.json({message:`you have successfully unfollowed ${unFollowUser.username}`})
           }else{
               res.json({message:`you do not follow ${unFollowUser.username}`})
           }
        } catch (error) {
            res.status(404).json({message:"stopped working in unfollow"})
        }
    }else{
        res.status(403).json({message:'you cant unfollow yourself'})
    }
})


module.exports = router