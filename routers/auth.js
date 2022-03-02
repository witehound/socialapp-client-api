const router = require("express").Router()
const user = require("../models/userModels")
const bcrypt = require("bcrypt")

//register
router.post("/register", async (req,res)=>{
   try {
       //hashing incoming password
       const salt = await bcrypt.genSalt(10)
       const hashedPassword = await bcrypt.hash(req.body.password, salt)

       //accepting incoming register json
       const User = new user({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
        })
       const newUser = await User.save()
       res.json(newUser)

   } catch (error) {
       res.json({status: error, message:"cant register"})
   }

})

//login
router.post("/login", async (req,res)=>{
    try {
        const User = await user.findOne({email: req.body.email})
        !User && res.json({message: "no user match"})
        
        const validPassword = await bcrypt.compare(req.body.password, User.password)
        !validPassword && res.status(404).json({message:"incorrect password"})

        res.json(User)
    } catch (error) {
        res.json(error)
    }
    
})

module.exports = router