const jwt = require("jsonwebtoken");
const teachers = require("../modules/teachers.modules")
const students = require("../modules/students.modules")
const mongoose = require("mongoose");

const checker = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({
                success: "failed",
                msg: "Unauthorized , no token provided"
            });
        }
        let decodedToken = jwt.verify(token, "secret");
        if (!decodedToken.userId) {
            return res.status(401).json({
                success: false,
                msg: "Unauthorized ,invalid token"
            });
        }
        req.userId = decodedToken.userId;
        req.userId = new mongoose.Types.ObjectId(req.userId);
        next();
    } catch (error) {
        res.status(500).send({
            status: 500,
            msg: "server  error " + error.message,
        })
    }
}
// teachers auth
const teacherAuth = async (req, res, next) => {
    try {
        const id = req.userId
        const teacher = await teachers.findById(id);
        if (!teacher) {
            return res.status(404).json({
                status: 404,
                message: "Unouthorized access !"
            });
        }
        next();
    } catch (error) {
        res.status(500).send({
            status: 500,
            message: "server error " + error.message
        })
    }
}
// changing students mark auth
const studentListAuth = async (req, res, next) => {
    try {
        let studentid = req.params.studentid;
        const convertedStudentid = new mongoose.Types.ObjectId(studentid);
        const teacherid = req.userId;
        const teacher = await teachers.findById(teacherid)
        const user = await students.findById(convertedStudentid)
        if (!user) {
            return res.status(404).send({
                success: false,
                msg: "no student found with such id "
            })
        }
        if (!teacher.students.includes(user._id)) {
            return res.status(400).send({
                success: false,
                msg: "your not allowed to chang mark for this student, student not in your group ! "
            })
        }
        next();
    } catch (error) {
        res.status(500).send({
            status: 500,
            message: "server error " + error.message
        })
    }
}
// students authentication
const studentAuth = async (req, res, next) => {
    try {
        const id = req.userId;
        const user = await students.findById(id);
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "Unouthorized access !"
            });
        }
        next();
    } catch (error) {
        res.status(500).send({
            status: 500,
            message: "server error " + error.message
        })
    }
}
// check if student in session cant use any other methode until he leave
const check_availabile = async (req, res, next) => {
    try {
        const id = req.userId;
        const [teacher , student] = await Promise.all([ 
                    teachers.findOne(id) ,
                    students.findOne(id) 
        ]) 
        const user = teacher || student ;
        if (user && user.available) {
            return res.status(404).json({
                status: 404,
                message: "your in a session now, you cant use this route until you leave!"
            });
        }
        next();
    } catch (error) {
        res.status(500).send({
            status: 500,
            message: "server error " + error.message
        })
    }
}
module.exports = {
    checker,
    teacherAuth,
    studentListAuth,
    studentAuth,
    check_availabile
};