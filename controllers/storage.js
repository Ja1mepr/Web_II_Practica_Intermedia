const StorageModel = require('../models/storage')

const createItem = async (req, res) => {
    try{
        const data = req
        console.log(data.filename)
        console.log(data.url)
        const file = {
            filename: data.filename,
            url: data.url+"/"+data.filename
        }
        const fileData = await StorageModel.create(file)
        console.log(fileData)
        res.status(200).json(fileData)
    }catch(err){
        console.log(err)
        res.status(403).send("ERROR_UPLOADING_IMAGE")
    }
}

module.exports = {createItem}