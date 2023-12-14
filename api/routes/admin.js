const express = require('express');
const router = express.Router();
const controller = require('../controllers/admin.controller')
const roleMiddleware = require('../middleware/roleMiddleware')
const authMiddleware = require('../middleware/authMiddleware')


router.use(authMiddleware)
router.use(roleMiddleware('Administrator'))

/* GET users listing. */
router.get('/', async (req, res, next) => {
    await controller.getAllProfessorsAverageScore(req, res)
});

module.exports = router;