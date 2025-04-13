const {Router} = require("express")
const router = Router()
const controller = require("../controller/teachers.controller");
const middleware = require("../middleware/auth.middelware");

router.post("/set-student-mark/:studentid",middleware.teacherAuth,middleware.studentListAuth, controller.set_student_mark)
router.post("/session/start-session"  ,middleware.teacherAuth,controller.start_session)
router.get("/session/end-session"  ,middleware.teacherAuth,controller.end_session)
router.get("/view-my-students"  ,middleware.teacherAuth,controller.view_students)
router.get("/session/view-session-students"  ,middleware.teacherAuth,controller.session_students)
router.get("/view-info",middleware.teacherAuth, controller.view_teacher_info)
module.exports = router ;