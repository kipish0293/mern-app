const { Router } = require('express')
const fileMiddleware = require('../middlware/file.middleware')
const auth = require('../middlware/auth.middleware')
const Images = require('../models/Images')
const config = require('config')

const router = Router()

function escapeHtml(text) {
    var map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
      ":": '-',
      "\\": "/",
    };
  
    return text.replace(/[&<>:\\"']/g, function(m) { return map[m]; });
}

router.post('/upload', auth, fileMiddleware.single('photo'), async (req, res) => {
    try {
        if(req.file) {
            const baseUrl = config.get('baseUrl')
            const name = req.file.filename
            const path = baseUrl + '/' + escapeHtml(req.file.path)

            const image = new Images({
                name, path
            })
    
            await image.save()

            res.status(201).json({image})
        }
    } catch (error) {
        res.status(500).json({message : "Что-то пошло не так, попробуйте снова"})
    }
})

router.get('/get-images', auth, async (req, res) => {
    try {
        const images = await Images.find()
        res.json(images)
    } catch (error) {
        res.status(500).json({message : "Что-то пошло не так, попробуйте снова"})
    }
})


module.exports = router;

