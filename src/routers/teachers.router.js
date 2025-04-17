const {Router} = require("express")
const router = Router()
const controller = require("../controller/teachers.controller");
const middleware = require("../middleware/auth.middelware");

router.post("/set-student-mark/:studentid",middleware.teacherAuth,middleware.studentListAuth, controller.set_student_mark)
router.post("/session/start-session"  ,middleware.teacherAuth,controller.start_session)
router.get("/session/end-session"  ,middleware.teacherAuth,controller.end_session)
router.get("/view-students"  ,middleware.teacherAuth,controller.view_students)
router.get("/session/students-session"  ,middleware.teacherAuth,controller.session_students)
router.get("/session/manage-requests/status?"  ,middleware.teacherAuth,controller.manage_requests)
router.get("/view-requests",middleware.teacherAuth, controller.view_requests)
router.get("/view-profile",middleware.check_availabile,middleware.teacherAuth, controller.view_teacher_profile)

module.exports = router ;