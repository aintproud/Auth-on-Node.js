const express = require('express')
const mongoose = require('mongoose')
const router = require('./controller')
const PORT = process.env.PORT || 5000
const app = express()

// start the server
app.use(express.json())
app.use("/auth", router)
const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
        app.listen(PORT, () => console.log(`server on ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()