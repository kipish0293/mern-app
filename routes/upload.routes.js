const { Router } = require('express')
const fileMiddleware = require('../middlware/file.middleware')

const router = Router()

router.post('/upload', fileMiddleware.single('photo'), (req, res) => {
    try {
        if(req.file) {
            res.json(req.file)
        }
    } catch (error) {
        res.status(500).json({message : "Что-то пошло не так, попробуйте снова"})
    }
})

module.exports = router;

