const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware')

const controller = require('../controllers/student.controller')

router.use(authMiddleware)
/* GET users listing. */
router.post('/students_by_groups', async (req, res, next) => {
    // controller.checkHeadStudent(req, res)
    await controller.getUserInfo(req, res)
});

// router.post('/', (req, res, next) => {
//     controller.create(req, res)
//
// })

router.post('/disciplines', async (req, res, next) => {
    await controller.getDistributedLoad(req, res)
})

router.post('/quiz', async (req, res, next)=> {
    await controller.setTeacherScore(req, res, next)
})

module.exports = router;
