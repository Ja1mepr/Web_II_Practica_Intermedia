const CompanyModel = require('../models/company')
const {matchedData} = require('express-validator')

const onBoarding = async (req, res) => {
    try{
        const data = matchedData(req)
        if(req.user.autonomous){
            const dataCompany = req.user
        }else{
            const dataCompany = data
        }
        const company = await CompanyModel.create(dataCompany)
        res.status(200).json(company)
    }catch(err){
        console.log(err)
        res.status(403).json("ERROR_ON_BOARDING_COMPANY")
    }
}

module.exports = {onBoarding}