//Conexion a Mongo
const mongoose = require('mongoose')

const dbConnect = () => {
    const db_url = process.env.DB_URI
    mongoose.set('strictQuery', false)
    try{
        mongoose.connect(db_url)
        console.log('Conexion establecida con MongoDB')
    }catch(err){
        console.error('Error intentar establecer la conexión con MongoDB')
    }
}

module.exports = dbConnect