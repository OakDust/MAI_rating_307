const express = require('express');
const router = express.Router();
const db = require('pg')


const controller = require('../controllers/student.controller')

/* GET users listing. */
router.post('/students_by_groups', async (req, res, next) => {
    // controller.checkHeadStudent(req, res)
    await controller.getUserInfo(req, res)
});

router.post('/', (req, res, next) => {
    controller.create(req, res)

})

module.exports = router;
