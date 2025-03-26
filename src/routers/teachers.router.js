const {Router} = require("express")
const router = Router()
const controller = require("../controller/teachers.controller");
const middleware = require("../middleware/auth.middelware");

router.post("/set-student-mark" , middleware.auth ,controller.set_student_marks)
router.post("/start-session"  ,controller.start_session)
router.post("/view-my-students"  ,controller.view_students)

module.exports = router ;