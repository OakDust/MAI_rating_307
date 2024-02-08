const express = require('express');
const router = express.Router();
const controller = require('../controllers/admin.controller')
const roleMiddleware = require('../middleware/roleMiddleware')
const authMiddleware = require('../middleware/authMiddleware')
const mailService = require('../service/recovery.service')

router.use(authMiddleware)
router.use(roleMiddleware('Administrator'))

/* GET users listing. */
router.get('/', async (req, res, next) => {
    await controller.getAllProfessorsAverageScore(req, res)
});

router.post('/changePassword', async (req, res, next) => {
    await mailService.changePassword(req, res)
})

router.post('/getCommentsByProfessorsId', async(req, res, next) => {
    await controller.getCommentsByProfessorsId(req, res)
})

module.exports = router;