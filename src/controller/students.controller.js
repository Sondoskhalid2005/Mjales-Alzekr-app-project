const teachers = require("../modules/teachers.modules");
const students = require("../modules/students.modules");
const sessions = require("../modules/sessions.module")
const mongoose = require("mongoose");

// view_mark
const view_mark = async (req, res) => {
    try {
        const studentid = req.userId;
        const student = await students.findById(studentid);
        if (student.mark) {
            res.status(200).send({
                success: true,
                "mark": student.mark
            })
        }else
        res.status(200).send({
            success: true,
            "mark": "no mark set yet"
        })
    }catch (error) {
        res.status(500).send({
            status: 500,
            message: "server error " + error.message
        })
    }
}
// view_taecher
const view_teacher = async (req, res) => {
    try {
        const studentid = req.userId;
        const student = await students.findById(studentid);
        const teacher = await teachers.findById(student.teacherId)
        res.status(200).send({
            success: true,
            "teacher name": teacher.username
        })
    } catch (error) {
        res.status(500).send({
            status: 500,
            message: "server error " + error.message
        })
    }
}
// session_to_join
const available_session = async (req, res) => {
    try {
        const studentid = req.userId;
        const student = await students.findById(studentid);
        const teacher = await teachers.findById(student.teacherId)
        const session = await sessions.findOne({
            teacherId: teacher._id
        })
        if (teacher.available && session) {
            res.status(200).send({
                success: true,
                "teacher name": teacher.username,
                "available": "your teacher started a session, you can join !",
                "session name": session.sessionName
            })
        } else {
            res.status(200).send({
                success: true,
                "teacher name": teacher.username,
                "available": "no available session to joined !"
            })
        }
    } catch (error) {
        res.status(500).send({
            status: 500,
            message: "server error " + error.message
        })
    }
}
// join_session
const join_session = async (req, res) => {
    try {
        const studentid = req.userId;
        const student = await students.findById(studentid);
        const teacher = await teachers.findById(student.teacherId)
        const session = await sessions.findOne({teacherId: teacher._id})
        if (!teacher.available && !session) {
            return res.status(404).send({
                success: false,
                message: "no active session to join with your teacher !"
            })
        }
        if (session.studentsId.includes(student._id) && student.available) {
            return res.status(404).send({
                success: false,
                message: " your already in a session with your teacher now !"
            })
        }
        if (teacher.available && session) {
            session.studentsId.push(studentid);
            await students.findByIdAndUpdate(studentid, {available: true})
            await session.save()
            return res.status(200).send({
                success: true,
                "your joining a session , with your teacher": teacher.username,
                "sesssion name ": session.sessionName,
            })
        }
      
    } catch (error) {
        res.status(500).send({
            status: 500,
            message: "server error " + error.message
        })
    }
}
// leave_session
const leave_session = async (req, res) => {
    try {
        const studentid = req.userId;
        const student = await students.findById(studentid);
        const teacher = await teachers.findById(student.teacherId)
        const session = await sessions.findOne({teacherId: teacher._id})
        if (!session || !session.studentsId.includes(student._id)) {
            res.status(404).send({
                success: false,
                "msg": "no session joined to leave !"
            })
        } else {
            session.studentsId.pull(student._id); // remove the student in session collection
            await students.findByIdAndUpdate(student._id, {available: false})
            await session.save()
            res.status(200).send({
                success: true,
                "session name": session.sessionName,
                "msg": "left the session successfully !"
            })
        }
    } catch (error) {
        res.status(500).send({
            status: 500,
            message: "server error " + error.message
        })
    }
}
// view_student_info
const view_student_info = async (req, res) => {
    try {
        const studentid = req.userId;
        const student = await students.findById(studentid);
        const teacher = await teachers.findById(student.teacherId)
        return res.status(200).send( 
            {
         success : true ,
        "student name ": student.username,
        "student email ": student.email,
        "student id ": student._id,
        "student teacher ": teacher.username,})
    }catch (error) {
        res.status(500).send({
            status: 500,
            message: "server error " + error.message
        })
    }
}
module.exports = {
    view_mark,
    view_teacher,
    available_session,
    join_session,
    leave_session,
    view_student_info
}