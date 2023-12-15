const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller')


router.get('/', async (req, res, next) => {
    // const teacher = await Teacher.findAll()
    //
    // const output = JSON.stringify(teacher)
    //
    // res.send(output)

});

router.post('/professor', async (req, res, next) => {
    await controller.professorAuth(req, res)
})

router.post('/studentAuth', async (req, res, next) => {
    await controller.studentAuth(req, res)

})

module.exports = router;