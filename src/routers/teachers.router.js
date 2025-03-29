const {Router} = require("express")
const router = Router()
const controller = require("../controller/teachers.controller");
const middleware = require("../middleware/auth.middelware");

router.post("/set-student-mark/:studentid",/*/middlewarehere /*/ controller.set_student_mark)
router.post("/start-session"  ,controller.start_session)
router.get("/end-session"  ,controller.end_session)

router.get("/view-my-students"  ,controller.view_students)

module.exports = router ;