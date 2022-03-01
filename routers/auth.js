const router = require("express").Router()

router.get("/test", (req,res)=>{
    res.json({message: "user path set"})
})

module.exports = router