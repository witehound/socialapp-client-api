const express = require("express")
const helmet = require("helmet")
const morgan = require("morgan")
const app = express()
const user = require("./routers/auth")


//listen
app.listen(8800, ()=>{
    console.log("server is live on port 8000")
})

//apps to use
app.use(express.json())
app.use(helmet())
app.use(morgan("tiny"))

app.get("/", (req,res)=>{
    res.json({message: "welcome"})
})