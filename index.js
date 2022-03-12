const express = require("express")
const tfjs = require("@tensorflow/tfjs-node")
const path = require("path")
const app = express()

let port = process.env.PORT || 3000

app.get("/", async (req, res) => {
    const model = await tfjs.loadLayersModel("file://" + path.join( __dirname, "models/model.json"))
    model.summary()
    res.send("Hello world")
})

app.listen(port, () =>{
    console.log(`running server on port ${port}`)
})