const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require('../middleware/roleMiddleware')

const controller = require('../controllers/student.controller')

router.use(authMiddleware)
router.use(checkRole('Student'))

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
    // subsitute with getDistributedLoad cause it isnt crud
    await controller.provideDistributedLoad(req, res)
})

router.post('/quiz', async (req, res, next)=> {
    await controller.setTeacherScore(req, res, next)
})

router.get('/getTeachers', async (req, res, next) => {
    await controller.getTeachers(req, res)
})

router.get('/getDisciplines', async (req, res, next) => {
    await controller.getDisciplines(req, res)
})

router.put('/updateTeacher', async (req, res, next) => {
    await controller.updateTeacher(req, res)
})


module.exports = router;
