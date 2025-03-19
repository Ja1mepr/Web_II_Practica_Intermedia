const express = require('express')
const fs = require('fs')

const router = express.Router()

const removeExtensions = (filename) => {
   return  filename.split('.').shift()
}

fs.readdirSync(__dirname).filter((file) => {
    const name = removeExtensions(file)
    if(name!='index')
        router.use('/'+name, require('./'+name))
})

module.exports = router