const express = require("express")
const tfjs = require("@tensorflow/tfjs-node")
const path = require("path")
const app = express()
//import {wordsArray} from "./utils/words.js"
const wordsArray = require("./utils/words.js")
const song = require("./utils/example_song")
const bodyParser = require('body-parser');
let port = process.env.PORT || 3000

const processText = (text, wordsArray) => {
    const preprocessedText = text.toLowerCase().replace(/,/g,"").replace(/\n/g, " ").replace("!","").replace("(","").replace(")","").replace(",","")
    textArray = preprocessedText.split(" ")
    let counter = 0
    let map = {}
    textArray.forEach(item => {
        if(wordsArray.includes(item)){
            counter = counter + 1;
            if(map[item]){
                map[item] = map[item] + 1
            } else {
                map[item] = 1
            }
        }
    })
    let tensor = new Array(5000).fill(0);

    for (const [key, value] of Object.entries(map)){
        let index = wordsArray.indexOf(key)
        tensor[index] = value
    }
    return tensor
}
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.raw());
app.use(express.json())
app.get("/", async (req, res) => {
    const model = await tfjs.loadLayersModel("file://" + path.join( __dirname, "models/model.json"))
    const tensor = tfjs.tensor([processText(song, wordsArray)])
    const result = model.predict(tensor)
    const resutlArr = result.dataSync()
    const genres = ["Blues",
        "Country",
        "Electronic",
        "Folk",
        "International",
        "Jazz",
        "Latin",
        "NewAge",
        "PopRock",
        "Rap",
        "Reggae",
        "RnB",
        "Vocal"]
    const resultObj = {}
    resutlArr.forEach((item, idx) => {
        resultObj[genres[idx]] = item
        }
    )
    console.log(resultObj)
    res.json(resultObj)
})

app.post('/', async(req, res) => {
    const model = await tfjs.loadLayersModel("file://" + path.join( __dirname, "models/model.json"))
    const text = req.body.text
    console.log(text)
    const tensor = tfjs.tensor([processText(text, wordsArray)])
    const result = model.predict(tensor)
    const resutlArr = result.dataSync()
    const genres = ["Blues",
        "Country",
        "Electronic",
        "Folk",
        "International",
        "Jazz",
        "Latin",
        "NewAge",
        "PopRock",
        "Rap",
        "Reggae",
        "RnB",
        "Vocal"]
    const resultObj = {}
    resutlArr.forEach((item, idx) => {
            resultObj[genres[idx]] = item
        }
    )
    console.log(resultObj)
    res.json(resultObj)
});

app.listen(port, () =>{
    console.log(`running server on port ${port}`)
    processText(song, wordsArray)
    console.log(wordsArray.length)
})