const CompanyModel = require('../models/company')
const UserModel = require('../models/users')
const {matchedData} = require('express-validator')

const onBoarding = async (req, res) => {
    try{
        console.log(req.user.autonomous)
        const data = matchedData(req)
        const user = req.user
        let company
        if(user.nif==null){
            res.status(400).send('USER_REQUIRE_FIELD_NIF')
        }
        //Si no es autonomo lo anade como empleado de la empresa correspondiente al cif
        if(!user.autonomous){
            company = await CompanyModel.findOneAndUpdate({cif: data.cif}, {$addToSet: {employees: user._id}})
            if(company==null)
                console.log(`El empleado no ha podido ser anadido a la compania con cif: ${data.cif}`)
            else{
                const updatedUser = await UserModel.findOneAndUpdate({email: user.email}, {company: company._id})
                console.log(`Usuario: ${user.name}, ${user._id}\nHa sido anadido como empleado de: ${company.name}, ${company.cif}`)
            }
        //Si es autonomo crea una empresa con sus datos personales
        }else{
            //Con upsert lo crea si no existe
            company = await CompanyModel.findOneAndUpdate({cif: user.nif}, {name: data.name}, {upsert: true, new: true})
            console.log(`Compania ${company.name} creada por ${user.name}`)
        }
        res.status(200).json(company)
    }catch(err){
        console.log(err)
        res.status(403).json("ERROR_ON_BOARDING_COMPANY")
    }
}

module.exports = {onBoarding}