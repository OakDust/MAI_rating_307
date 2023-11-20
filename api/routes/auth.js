const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller')
const Teacher = require('../models/teacher')

router.get('/', async (req, res, next) => {
    // const teacher = await Teacher.findAll()
    //
    // const output = JSON.stringify(teacher)
    //
    // res.send(output)

});

router.post('/professor', (req, res, next) => {
    controller.professorAuth(req, res)
})

router.post('/studentAuth', (req, res, next) => {
    controller.studentAuth(req, res)

})

module.exports = router;