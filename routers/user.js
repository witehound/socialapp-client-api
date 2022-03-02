const router = require("express").Router()
const user = require("../models/userModels")
const bcrypt = require("bcrypt")

//update user
router.put("/:id", async (req,res)=>{
    if(req.body.id === req.params.id || req.body.isAdmin){
        if(req.body.password){
            try {
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(req.body.password,salt)
            } catch (error) {
                res.json({message:""})
            }
        }
        try {
            const User = await user.findByIdAndUpdate(req.body.id, {$set: req.body})
            res.json(User)
        } catch (error) {
            res.json({error})
        }
    }else{
        res.status(404).json("you can only update your profile")
    }
})

//delete user
//get user
//follow a user


module.exports = router