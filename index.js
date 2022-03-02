const express = require("express")
const helmet = require("helmet")
const morgan = require("morgan")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const app = express()
const authRoute = require("./routers/auth")
const userRoute = require("./routers/user")

dotenv.config()

//listen
app.listen(8800, ()=>{
    console.log("server is live on port 8800")
})

//connect my mongodb
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser : true,
    useUnifiedTopology: true
}, ()=> console.log("mongoDB is running!"))

//middleware
app.use(express.json())
app.use(helmet())
app.use(morgan("tiny"))

//auth route
app.use("/auth", authRoute)

//user route
app.use("/user", userRoute)

app.get("/", (req,res)=>{
    res.send("welcome")
})