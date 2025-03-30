const {Router} = require("express")
const router = Router()
const controller = require("../controller/students.controller");

router.get("/view-mark", controller.view_mark)
router.get("/view-my-teacher", controller.view_teacher)
router.get("/available-session", controller.available_session)
router.get("/join-session", controller.join_session)
router.get("/leave-session", controller.leave_session)

module.exports = router ;