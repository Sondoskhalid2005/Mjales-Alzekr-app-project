const {Router} = require("express")
const router = Router()
const controller = require("../controller/students.controller");
const middleware=require("../middleware/auth.middelware")

router.get("/view-mark",middleware.studentAuth,controller.view_mark)
router.get("/view-teacher",middleware.studentAuth, controller.view_teacher)
router.get("/available-session",middleware.studentAuth, controller.available_session)
router.get("/join-session",middleware.studentAuth, controller.join_session)
router.get("/leave-session",middleware.studentAuth, controller.leave_session)

module.exports = router ;