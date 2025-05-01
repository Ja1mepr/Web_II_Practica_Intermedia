const deliveryNote = require('../models/deliverynote')
const DeliverynoteModel = require('../models/deliverynote')
const ProjectModel = require('../models/project')
const UserModel = require('../models/users')
const {matchedData} = require('express-validator')
const pdfDocument = require('pdfkit')

const getItem = async (req, res) => {
    try{
        const deliverynote_id = req.params.id
        const deliverynote = await DeliverynoteModel.findById(deliverynote_id)
        .populate({
            path: 'project',
            populate: {
                path: 'client_associated',
                model: 'client'
            }
        }).populate('createdBy')
        res.status(200).json(deliverynote)
    }catch(err){
        console.log(err)
        res.status(403).json("ERROR_GETTING_DELIVERYNOTE")
    }
}

const getItems = async (req, res) => {
    try{
        const associated = req.user
        deliverynotes = await DeliverynoteModel.find({createdBy: associated._id})
        res.status(200).json(deliverynotes)
    }catch(err){
        console.log(err)
        res.status(403).json("ERROR_GETTING_DELIVERYNOTES")
    }
} 

const createItem = async (req, res) => {
    try{
        const data = matchedData(req)
        const user = req.user
        const project = await ProjectModel.findOne({name: data.project_name})
        console.log(project)
        const body = {...data, project_name: data.project_name,
            project: project._id, createdBy: user._id, data}
        const client = await DeliverynoteModel.create(body)
        res.status(200).json(client)
    }catch(err){
        console.log(err)
        res.status(403).json("ERROR_CREATING_DELIVERYNOTE")
    }
}

const generatePDF = async (deliverynote_id) => {
    try{
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument()
            const chunks = []
        
            doc.on('data', (chunk) => chunks.push(chunk))
            doc.on('end', () => {
              const pdfBuffer = Buffer.concat(chunks)
              resolve(pdfBuffer)
            })
            doc.on('error', (err) => reject(err))
        
            doc.fontSize(18).text('Deliverynote', { align: 'center' })
            doc.moveDown()
        
            doc.fontSize(12).text(`Number: ${deliverynote.number}`)
            doc.text(`Date: ${new Date(deliverynote.date).toLocaleDateString()}`)
            doc.text(`Project: ${deliverynote.project_name || deliverynote.project?.name || '-'}`)
            doc.text(`Client: ${deliverynote.project?.client_associated?.name || '-'}`)
            doc.text(`CreatedBy: ${deliverynote.createdBy?.name || '-'}`)
            doc.moveDown()
        
            if (deliverynote.person?.length) {
              doc.fontSize(14).text('People:', { underline: true })
              deliverynote.person.forEach((p, idx) => {
                doc.fontSize(12).text(`- ${p.name || 'Unnamed'} (${deliverynote.hours?.[idx] || 0} horas)`)
              })
              doc.moveDown()
            }
        
            if (deliverynote.materials?.length) {
              doc.fontSize(14).text('Materials:', { underline: true })
              deliverynote.materials.forEach((m) => {
                doc.fontSize(12).text(`- ${m.name || 'Unnamed'}`)
              })
              doc.moveDown()
            }
        
            if (deliverynote.signature) {
              doc.fontSize(14).text('Signed', { align: 'right', underline: true })
              doc.text(`Sign: ${deliverynote.signature}`, { align: 'right' })
            } else {
              doc.fontSize(14).text('Not sign', { align: 'right' })
            }
        
            doc.end()
        })
    }catch(err){
        console.log(err)
        res.status(403).json("ERROR_GENERATING_PDF")
    }
}

const downloadItem = async (req, res) => {
    try{
        const deliverynote_id = req.params.id 
        const user = req.user
        const deliverynote = await DeliverynoteModel.findById(deliverynote_id)
        .populate({
            path: 'project',
            populate: {
                path: 'client_associated'
            }
        }).populate('createdBy')
        if(!deliverynote)
            res.status(404).json({ message: 'DELIVERY_NOTE_NOT_FOUND' })
        if(user._id!=deliverynote.createdBy || user.role=="guest")
            res.status(404).json({ message: 'USER_NOT_AUTHORIZED_TO_DOWNLOAD' })


        const pdfBuffer = await generatePDF(deliverynote)
        
        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', 'attachment; filename=documento.pdf')
        res.send(pdfBuffer)
    }catch(err){
        console.log(err)
        res.status(403).json("ERROR_DOWNLOADING_DELIVERYNOTE")
    }
} 

const signItem = async (req, res) => {
    try{
        const data = matchedData(req)
        const deliverynote_id = req.params.id
        const itemSigned = await deliveryNote.findByIdAndUpdate(deliverynote_id, {signature: data.signature}, {new: true})

        
        
    }catch(err){
        console.log(err)
        res.status(403).json("ERROR_SIGNING_DELIVERYNOTE")
    }
}

const deleteItem = async (req, res) => {
    try{
        const deliverynote_id = req.params.id
        const deliverynote = await DeliverynoteModel.findById(deliverynote_id)
        if(deliverynote.signature)
            res.status(200).json({message: 'DELIVERYNOTE_SIGNED_UNABLE_TO_DELETE'})
        await DeliverynoteModel.findByIdAndDelete(deliverynote_id)
        res.status(200).json({message: 'DELIVERYNOTE_DELETED'})
    }catch(err){
        console.log(err)
        res.status(403).json("ERROR_DELETING_DELIVERYNOTE")
    }
}

module.exports = {getItem, getItems, createItem, downloadItem, signItem, deleteItem}