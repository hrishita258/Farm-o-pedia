const express = require('express')
const fs = require('fs')
const path = require('path')
const multer = require('multer')

const router = express.Router()

const { authToken } = require('../../middlewares')
const { QuarantinedUserUpload } = require('../../models')
const { randomString } = require('../../util')

router.use(authToken)

const storage = multer.diskStorage({
    destination: (req, file, next) => next(null, 'uploads'),
    filename: (req, file, next) => next(null, req.user._id + '-' + randomString(8) + '-' + Date.now() + path.extname(file.originalname))
})

const imageFilter = (req, file, next) => {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|bmp|BMP|dip|DIP)$/)) {
        req.fileValidationError = 'Invalid image type'
        return next(null, false)
    }
    next(null, true)
}

const voiceNoteFilter = (req, file, next) => {
    if (!file.originalname.match(/\.(mp3|MP3|wav|WAV)$/)) {
        req.fileValidationError = 'Invalid audio type'
        return next(null, false)
    }
    next(null, true)
}

router.post('/location', async (req, res) => {
    if (!req.body.latitude || !req.body.longitude) return res.status(400).json({ status: 400, statusCode: 'failed', message: 'latitude and longitude are required' })
    let { latitude, longitude } = req.body
    let location = {
        latitude, longitude, date: new Date()
    }
    let date = new Date()
    let date1 = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
    let date2 = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 0, 0, 0, 0)
    const result = await QuarantinedUserUpload.findOne({
        _quarantinedUserId: req.user._id,
        createdAt: {
            $gte: date1,
            $lt: date2
        }
    })
    if (result) {
        try {
            await QuarantinedUserUpload.updateOne({
                _id: result._id
            }, {
                $push: {
                    locations: location
                }
            })
            res.status(201).json({ status: 201, statusCode: 'success', message: 'Upload Successfully' })
        } catch (err) {
            console.log(err)
            res.status(500).json({ status: 500, statusCode: 500, message: 'Something went wrong', error: err })
        }
    } else {
        try {
            await QuarantinedUserUpload.create({
                _quarantinedUserId: req.user._id,
                locations: [location]
            })
            res.status(201).json({ status: 201, statusCode: 'success', message: 'Upload Successfully' })
        } catch (err) {
            console.log(err)
            res.status(500).json({ status: 500, statusCode: 500, message: 'Something went wrong', error: err })
        }
    }
    // const quarantinedUserUpload = new QuarantinedUserUpload({
    //     _quarantinedUserId: req.user._id,
    //     uploadType: 'location',
    //     location: {
    //         latitude: req.body.latitude,
    //         longitude: req.body.longitude
    //     }
    // })
    // try {
    //     await quarantinedUserUpload.save()
    //     res.status(201).json({ status: 201, statusCode: 'success', message: 'Upload Successfully' })
    // } catch (err) {
    //     console.log(err)
    //     res.status(500).json({ status: 500, statusCode: 500, message: 'Something went wrong', error: err })
    // }
})

router.post('/text', async (req, res) => {
    if (!req.body.text) return res.status(400).json({ status: 400, statusCode: 'failed', message: 'text is required' })
    let text = { text: req.body.text, date: new Date() }
    let date = new Date()
    let date1 = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
    let date2 = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 0, 0, 0, 0)
    const result = await QuarantinedUserUpload.findOne({
        _quarantinedUserId: req.user._id,
        createdAt: {
            $gte: date1,
            $lt: date2
        }
    })
    if (result) {
        try {
            await QuarantinedUserUpload.updateOne({
                _id: result._id
            }, {
                $push: {
                    texts: text
                }
            })
            res.status(201).json({ status: 201, statusCode: 'success', message: 'Upload Successfully' })
        } catch (err) {
            console.log(err)
            res.status(500).json({ status: 500, statusCode: 500, message: 'Something went wrong', error: err })
        }
    } else {
        try {
            await QuarantinedUserUpload.create({
                _quarantinedUserId: req.user._id,
                texts: [text]
            })
            res.status(201).json({ status: 201, statusCode: 'success', message: 'Upload Successfully' })
        } catch (err) {
            console.log(err)
            res.status(500).json({ status: 500, statusCode: 500, message: 'Something went wrong', error: err })
        }
    }
    // const quarantinedUserUpload = new QuarantinedUserUpload({
    //     _quarantinedUserId: req.user._id,
    //     uploadType: 'text',
    //     text: req.body.text
    // })
    // try {
    //     await quarantinedUserUpload.save()
    //     res.status(201).json({ status: 201, statusCode: 'success', message: 'Upload Successfully' })
    // } catch (err) {
    //     console.log(err)
    //     res.status(500).json({ status: 500, statusCode: 500, message: 'Something went wrong', error: err })
    // }
})

// router.post('/image', multer({ storage, fileFilter: imageFilter }).single('file'), async (req, res) => {
//     if (!req.file) return res.status(400).json({ status: 400, statusCode: 400, message: 'Please upload a file' })
//     if (req.fileValidationError) return res.status(400).json({ status: 400, statusCode: 'failed', message: req.fileValidationError })
//     const quarantinedUserUpload = new QuarantinedUserUpload({
//         _quarantinedUserId: req.user._id,
//         uploadType: 'image',
//         image: req.file.filename
//     })
//     try {
//         await quarantinedUserUpload.save()
//         res.status(201).json({ status: 201, statusCode: 'success', message: 'Upload Successfully' })
//     } catch (err) {
//         console.log(err)
//         res.status(500).json({ status: 500, statusCode: 500, message: 'Something went wrong', error: err })
//     }
// })

// router.post('/voicenote', multer({ storage, fileFilter: voiceNoteFilter }).single('file'), async (req, res) => {
//     if (!req.file) return res.status(400).json({ status: 400, statusCode: 400, message: 'Please upload a file' })
//     if (req.fileValidationError) return res.status(400).json({ status: 400, statusCode: 'failed', message: req.fileValidationError })
//     const quarantinedUserUpload = new QuarantinedUserUpload({
//         _quarantinedUserId: req.user._id,
//         uploadType: 'voiceNote',
//         voiceNote: req.file.filename
//     })
//     try {
//         await quarantinedUserUpload.save()
//         res.status(201).json({ status: 201, statusCode: 'success', message: 'Upload Successfully' })
//     } catch (err) {
//         console.log(err)
//         res.status(500).json({ status: 500, statusCode: 500, message: 'Something went wrong', error: err })
//     }
// })

router.post('/image', async (req, res) => {
    let { file } = req.body
    if (!file) return res.status(400).json({ status: 400, statusCode: 'failed', message: 'Please upload a file' })
    let base64Image = file.split(';base64,').pop()
    let fileName = `${req.user._id + '-' + randomString(8) + '-' + Date.now()}.bmp`
    fs.writeFile(`uploads/${fileName}`, base64Image, { encoding: 'base64' }, async err => {
        if (err) {
            console.log(err)
            return res.status(500).json({ status: 500, statusCode: 'failed', message: 'Something wenrt wrong', error: err })
        }
        let obj = {
            url: fileName,
            date: new Date()
        }
        let date = new Date()
        let date1 = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
        let date2 = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 0, 0, 0, 0)
        const result = await QuarantinedUserUpload.findOne({
            _quarantinedUserId: req.user._id,
            createdAt: {
                $gte: date1,
                $lt: date2
            }
        })
        if (result) {
            try {
                await QuarantinedUserUpload.updateOne({ _id: result._id }, {
                    $push: {
                        images: obj
                    }
                })
                res.status(201).json({ status: 201, statusCode: 'success', message: 'Upload Successfully' })
            } catch (err) {
                console.log(err)
                res.status(500).json({ status: 500, statusCode: 500, message: 'Something went wrong', error: err })
            }
        } else {
            try {
                await QuarantinedUserUpload.create({
                    _quarantinedUserId: req.user._id,
                    images: [obj]
                })
                res.status(201).json({ status: 201, statusCode: 'success', message: 'Upload Successfully' })
            } catch (err) {
                console.log(err)
                res.status(500).json({ status: 500, statusCode: 500, message: 'Something went wrong', error: err })
            }
        }
        // const quarantinedUserUpload = new QuarantinedUserUpload({
        //     _quarantinedUserId: req.user._id,
        //     uploadType: 'image',
        //     image: fileName
        // })
        // try {
        //     await quarantinedUserUpload.save()
        //     res.status(201).json({ status: 201, statusCode: 'success', message: 'Upload Successfully' })
        // } catch (err) {
        //     console.log(err)
        //     res.status(500).json({ status: 500, statusCode: 500, message: 'Something went wrong', error: err })
        // }
    })
})

router.post('/voicenote', async (req, res) => {
    return res.send('under development')
    let { file } = req.body
    if (!file) return res.status(400).json({ status: 400, statusCode: 'failed', message: 'Please upload a file' })
    let fileName = `${req.user._id + '-' + randomString(8) + '-' + Date.now()}.3gp`
    fs.writeFile(`uploads/${fileName}`, file, async err => {
        if (err) {
            console.log(err)
            return res.status(500).json({ status: 500, statusCode: 'failed', message: 'Something wenrt wrong', error: err })
        }
        const quarantinedUserUpload = new QuarantinedUserUpload({
            _quarantinedUserId: req.user._id,
            uploadType: 'voiceNote',
            voiceNote: fileName
        })
        try {
            await quarantinedUserUpload.save()
            res.status(201).json({ status: 201, statusCode: 'success', message: 'Upload Successfully' })
        } catch (err) {
            console.log(err)
            res.status(500).json({ status: 500, statusCode: 500, message: 'Something went wrong', error: err })
        }
    })
})

module.exports = router