const express = require('express');
const router = express.Router();

const controller = require('../controllers/index.controller')


router.get('/', async (req, res, next) => {
});

router.post('/', (req, res, next) => {
    req.body.role === 'Студент' ? controller.createStudent(req, res) : controller.createProfessor(req, res)
})

module.exports = router;
