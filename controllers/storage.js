const StorageModel = require('../models/storage')

const createItem = async (req, res) => {
    try{
        const {body, file} = req
        console.log(file.filename)
        console.log(body.url)
        const data = {
            filename: file.filename,
            url: process.env.PUBLIC_URL+"/"+file.filename
        }
        const fileData = await StorageModel.create(data)
        console.log(fileData)
        res.status(200).json(fileData)
    }catch(err){
        console.log(err)
        res.status(403).send("ERROR_UPLOADING_IMAGE")
    }
}

module.exports = {createItem}