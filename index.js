const express = require('express')
const mongoose = require('mongoose')
const router = require('./router')
const PORT = process.env.PORT || 5000
const app = express()

// start the server
app.use(express.json())
app.use("/auth", router)
const start = async () => {
    try {
        await mongoose.connect(`mongodb+srv://qwerty:qwerty12@cluster0.gdhvr.mongodb.net/auth_roles?retryWrites=true&w=majority`)
        app.listen(PORT, () => console.log(`server on ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()