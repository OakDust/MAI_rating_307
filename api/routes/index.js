const express = require('express');
const router = express.Router();

const controller = require('../controllers/index.controller')
const Student = require("../models/student");


router.get('/', async (req, res, next) => {
});

router.post('/', (req, res, next) => {
    controller.create(req, res)
})

module.exports = router;
