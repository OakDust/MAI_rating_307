const express = require('express');
const router = express.Router();
const db = require('pg')


const controller = require('../controllers/student.controller')

/* GET users listing. */
router.get('/', (req, res, next) => {
    // controller.checkHeadStudent(req, res)

    controller.show(req, res)
});

router.post('/', (req, res, next) => {
    controller.create(req, res)

})

module.exports = router;
