const {Router} = require("express")
const router = Router()
const controller = require("../controller/students.controller");
const middleware=require("../middleware/auth.middelware")

router.get("/view-mark",middleware.check_availabile,middleware.studentAuth,controller.view_mark)
router.get("/view-teacher",middleware.check_availabile,middleware.studentAuth, controller.view_teacher)
router.get("/session/available-session",middleware.check_availabile,middleware.studentAuth, controller.available_session)
router.get("/session/join-session",middleware.studentAuth, controller.join_session)
router.get("/session/leave-session",middleware.studentAuth, controller.leave_session)
router.get("/session/session-request/:email",middleware.check_availabile,middleware.studentAuth, controller.session_request)
router.get("/session/outside-join/:email",middleware.check_availabile,middleware.studentAuth, controller.join_outside_session)
router.get("/session/view-response",middleware.check_availabile,middleware.studentAuth, controller.view_response)
router.get("/view-profile",middleware.check_availabile,middleware.studentAuth, controller.view_student_profile)
router.get("/view-all-teachers",middleware.check_availabile,middleware.studentAuth, controller.view_teachers)


module.exports = router ;