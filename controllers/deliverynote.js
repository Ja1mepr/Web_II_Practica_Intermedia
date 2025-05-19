const DeliverynoteModel = require('../models/deliverynote')
const ProjectModel = require('../models/project')
const ClientModel = require('../models/client')
const UserModel = require('../models/users')
const { matchedData } = require('express-validator')
const pinataSDK = require('@pinata/sdk')
const fs = require('fs').promises
const path = require('path')
const axios = require('axios')
const streamifier = require('streamifier')
const PDFDocument = require('pdfkit')

const getItem = async (req, res) => {
    try {
        const deliverynote_id = req.params.id
        const deliverynote = await DeliverynoteModel.findById(deliverynote_id)
            .populate({
                path: 'project',
                model: 'project',
                populate: {
                    path: 'client_associated',
                    model: 'client',
                    populate: {
                        path: 'createdBy',
                        model: 'users'
                    }
                }
            })
        res.status(200).json(deliverynote)
    } catch (err) {
        console.log(err)
        res.status(403).json("ERROR_GETTING_DELIVERYNOTE")
    }
}

const getItems = async (req, res) => {
    try {
        const user = req.user
        const deliverynotes = await DeliverynoteModel.find()
            .populate({
                path: 'project',
                model: 'project',
                populate: {
                    path: 'client_associated',
                    model: 'client',
                    populate: {
                        path: 'createdBy',
                        model: 'users',
                        match: {
                            _id: user._id
                        }
                    }
                }
            })
        res.status(200).json(deliverynotes)
    } catch (err) {
        console.log(err)
        res.status(403).json("ERROR_GETTING_DELIVERYNOTES")
    }
}

const createItem = async (req, res) => {
    try {
        const data = matchedData(req)
        const project = await ProjectModel.findOne({ name: data.project_name })
        const body = {
            ...data, project_name: data.project_name,
            project: project._id
        }
        const deliverynote = await DeliverynoteModel.create(body)
        res.status(201).json(deliverynote)
    } catch (err) {
        console.log(err)
        res.status(403).json("ERROR_CREATING_DELIVERYNOTE")
    }
}

const generatePDF = async (res, deliverynote_id) => {
    try{
        const deliverynote = await DeliverynoteModel.findById(deliverynote_id)
            .populate({
                path: 'project',
                populate: {
                    path: 'client_associated',
                    model: "client",
                    populate: {
                        path: 'createdBy',
                        model: "users"
                    }
                }
            });

        if(!deliverynote){
            res.status(404).send('ITEM_NOT_FOUND')
            return
        }

        return new Promise((resolve, reject) => {
            const doc = new PDFDocument()
            const chunks = []

            doc.on('data', chunk => chunks.push(chunk))
            doc.on('end', () => resolve(Buffer.concat(chunks)))
            doc.on('error', err => reject(err))

            // Título
            doc.fontSize(18).text('Delivery Note', { align: 'center' })
            doc.moveDown();

            // Datos generales
            doc.fontSize(12).text(`Number: ${deliverynote.number}`)
            doc.text(`Date: ${new Date(deliverynote.date).toLocaleDateString()}`)
            doc.text(`Project: ${deliverynote.project_name}`);
            doc.text(`Client: ${deliverynote.project?.client_associated?.name || '-'}`)
            doc.text(`User: ${deliverynote.project?.client_associated?.createdBy?.name || '-'}`)
            doc.moveDown();

            // Personas
            if(deliverynote.people?.length){
                doc.fontSize(14).text('People:', { underline: true })
                deliverynote.people.forEach(p => {
                    doc.fontSize(12).text(`- ${p.name || 'Unnamed'} | Rol: ${p.rol || '-'} | Hours: ${p.hours || '0'}`)
                });
                doc.moveDown()
            }

            // Materiales
            if(deliverynote.materials?.length){
                doc.fontSize(14).text('Materials:', { underline: true })
                deliverynote.materials.forEach(m => {
                    doc.fontSize(12).text(`- ${m.name || 'Unnamed'} | Units: ${m.units || '-'}`)
                });
                doc.moveDown()
            }

            // Firma
            if(deliverynote.signed){
                doc.fontSize(14).text('Signed', { align: 'right', underline: true })
                doc.fontSize(12).text(`Signature: ${deliverynote.signature || '(no image)'}`, { align: 'right' })
            }else{
                doc.fontSize(14).text('Not signed', { align: 'right' })
            }

            // CID de IPFS (opcional)
            if(deliverynote.pinata_CID){
                doc.moveDown();
                doc.fontSize(10).text(`IPFS CID: ${deliverynote.pinata_CID}`, { align: 'left' })
            }

            doc.end()
        })
    }catch (err){
        console.log(err)
        res.status(403).json("ERROR_GENERATING_PDF")
    }
}

const downloadItem = async (req, res) => {
    try{
        const deliverynote_id = req.params.id
        const user = req.user
        let deliverynotePDF
        const deliverynote = await DeliverynoteModel.findById(deliverynote_id)
            .populate({
                path: 'project',
                populate: {
                    path: 'client_associated',
                    model: 'client',
                    populate: {
                        path: 'createdBy',
                        model: 'users'
                    }
                }
            })
        if (!deliverynote){
            res.status(404).json('DELIVERY_NOTE_NOT_FOUND')
            return
        }
        const createdBy = deliverynote.project.client_associated.createdBy
        if (!(user._id.toString() === createdBy._id.toString() || user.role === "guest")){
            res.status(403).json('USER_NOT_AUTHORIZED_TO_DOWNLOAD')
            return
        }
        if(deliverynote.pinata_CID.deliverynotePDF===null)
            deliverynotePDF = await generatePDF(res, deliverynote._id)
        else{
            const IPFSUrl = `https://gateway.pinata.cloud/ipfs/${deliverynote.pinata_CID.deliverynotePDF}`
            const response = await axios.get(IPFSUrl, {
                responseType: 'arraybuffer',
            })
            deliverynotePDF = Buffer.from(response.data, 'binary')
        }
        const storagePath = path.join(__dirname, '..', 'storage', `deliverynote_${deliverynote_id}.pdf`)
        await fs.writeFile(storagePath, deliverynotePDF)
        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', 'attachment; filename=deliverynote.pdf')
        res.status(200).json('ITEM_DOWNLOADED')
    }catch(err){
        console.log(err)
        res.status(403).json('ERROR_DOWNLOADING_DELIVERYNOTE')
    }
}

const signItem = async (req, res) => {
    try {
        const data = matchedData(req)
        const deliverynote_id = req.params.id
        const pinata = new pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET)
        const itemSigned = await DeliverynoteModel.findById(deliverynote_id)
        itemSigned.signature = data.signature
        itemSigned.signed = true
        await itemSigned.save()

        const upItemCloud = await pinata.pinJSONToIPFS(itemSigned, {
            pinataMetadata: {
                name: `deliverynote_${deliverynote_id}.json`
            }
        })
        itemSigned.pinata_CID.deliverynote = upItemCloud.IpfsHash
        
        const deliverynotePDF = await generatePDF(res, itemSigned._id)
        const stream = streamifier.createReadStream(deliverynotePDF)
        const upPDFCloud = await pinata.pinFileToIPFS(stream, {
            pinataMetadata: {
                name: `deliverynotePDF_${deliverynote_id}.pdf`
            }
        })
        itemSigned.pinata_CID.deliverynotePDF = upPDFCloud.IpfsHash
        await itemSigned.save()
        res.status(200).json(itemSigned)
    } catch (err) {
        console.log(err)
        res.status(403).json("ERROR_SIGNING_DELIVERYNOTE")
    }
}

const deleteItem = async (req, res) => {
    try {
        const deliverynote_id = req.params.id
        const deliverynote = await DeliverynoteModel.findById(deliverynote_id)
        if(!deliverynote){
            res.status(404).send('ITEM_NOT_FOUND')
        }
        if(deliverynote.signature){
            res.status(403).json('DELIVERYNOTE_SIGNED_UNABLE_TO_DELETE')
            return
        }
        await DeliverynoteModel.findByIdAndDelete(deliverynote_id)
        res.status(200).json('DELIVERYNOTE_DELETED')
    } catch (err) {
        console.log(err)
        res.status(403).json("ERROR_DELETING_DELIVERYNOTE")
    }
}

module.exports = { getItem, getItems, createItem, downloadItem, signItem, deleteItem }