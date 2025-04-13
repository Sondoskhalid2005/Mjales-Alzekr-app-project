const teachers = require("../modules/teachers.modules");
const students = require("../modules/students.modules");
const sessions = require("../modules/sessions.module")
const mongoose = require("mongoose");

// set_student_mark
const set_student_mark = async (req, res) => {
    try {
        let {
            studentid
        } = req.params;
        const {
            mark
        } = req.body;
        studentid = new mongoose.Types.ObjectId(studentid);
        const teacherid = req.userId;
        const student = await students.findById(studentid)
        await students.findByIdAndUpdate(studentid, {
            mark: mark
        });
        const updatedStudent = await students.findById(studentid)
        return res.status(201).send({
            "success": true,
            "message": "student mark changed seccessfuly",
            "student name": updatedStudent.username,
            "student email": updatedStudent.email,
            "student new mark": updatedStudent.mark
        });
    } catch (error) {
        res.status(500).send({
            status: 500,
            message: "server error " + error.message
        })
    }
}
// start_session 
const start_session = async (req, res) => {
    try {
        const teacherid = req.userId;
        const {
            sessionname
        } = req.body; //...will see if beter to take seperate attributes in body
        const teacher = await teachers.findById(teacherid);
        if (!sessionname) {
            return res.status(404).send({
                success: false,
                msg: "put session name in request body"
            })
        }
        if (teacher.available) { // means teacher in a session and can not be start new session
            return res.status(201).send({
                "success": false,
                "msg": "cant make a new session, you are already in a session ! "
            });
        } else {
            await teachers.findByIdAndUpdate(teacherid, {
                available: true
            });
            const newSession = new sessions({
                sessionName: sessionname,
                teacherId: teacherid,
            })
            await sessions.create({
                sessionName: sessionname,
                teacherId: teacherid
            });
            return res.status(201).send({
                "success": true,
                "message": "New Session started , students can join now ! ",
                "session name": newSession.sessionName,
                "session teacher": teacher.username,
            });
        }
    } catch (error) {
        res.status(500).send({
            status: 500,
            message: "server error " + error.message
        })
    }
}
// view_students
const view_students = async (req, res) => {
    try {
        const teacherid = req.userId;
        const studentlist = await students.find({
            teacherId: teacherid
        });
        let mappedStudent = studentlist.map((stud) => ({
            name: stud.username,
            id: stud._id,
            mark: stud.mark }))
        if (studentlist.length == 0) {
            return res.status(200).send({
                success: true,
                message: " you have no students yet "
            })
        }
        return res.status(200).send({
            success: true,
            "students": mappedStudent
        });
    } catch (error) {
        res.status(500).send({
            status: 500,
            message: "server error " + error.message
        })
    }
}
// end_session
const end_session = async (req, res) => {
    try {
        const teacherid = req.userId;
        const teacher = await teachers.findById(teacherid);
        const session = await sessions.findOne({
            teacherId: teacher._id
        }); 
        if (!teacher.available && !session) {
            return res.status(404).send({
                "success": false,
                message: "your didnt start a session to end ! "
            });
        } else {
            await teachers.findByIdAndUpdate(teacherid, {
                available: false
            });
            console.log("here dont forget to test then delete"); 
            await students.updateMany(
                { _id: { $in: session.studentsId.map(id => id) } }, // change all students in session availabiliy into false
                { available: false }
              );
            console.log("working successfully");
            await sessions.deleteMany({
                teacherId: teacherid
            });
            return res.status(201).send({
                "success": true,
                 message: "session ended succssefully"
            });
        }
    } catch (error) {
        res.status(500).send({
            status: 500,
            message: "server error " + error.message
        })
    }
}
// session_students
const session_students = async (req, res) => {
    try {
        const teacherid = req.userId;
        const teacher = await teachers.findById(teacherid);
        const session = await sessions.findOne({
            teacherId: teacher._id
        });
        if (session) {
            const sessionStudentlist = session.studentsId;
            let allStudents = await students.find(); //return all students
            let filterdStudent = allStudents.filter(stud => sessionStudentlist.includes(stud._id)) //
            const mapedStudents = filterdStudent.map(stud => ({
                id: stud._id,
                name: stud.username
            }))
            if (filterdStudent.length == 0) {
                return res.status(200).send({
                    "success": true,
                    message: "no students joined yet"
                });
            }
            return res.status(200).send({
                "success": true,
                "students joining your session": mapedStudents
            });
        } else if (!session) {
            return res.status(404).send({
                "success": false,
                 message: "no session started yet to view its students!"
            })
        }
    } catch (error) {
        res.status(500).send({
            status: 500,
            message: "server error " + error.message
        })
    }
}
// view_teacher_info 
const view_teacher_info = async (req, res) => {
    try {
        const teacherid = req.userId;
        const teacher = await teachers.findById(teacherid)
        const studentlist = await students.find({
            teacherId: teacherid
        });
        let mappedStudent = studentlist.map((stud) => ({
            name: stud.username,
            id: stud._id,
            mark: stud.mark
        }))
        if(mappedStudent.length==0){
        return res.status(200).send( 
            {
         success : true ,
        "teacher name ": teacher.username,
        "teacher email ": teacher.email,
        "teacher id ": teacher._id,
        "teacher students": "you have no students yet "})
            }
            else{
                return res.status(200).send( 
                    {
                 success : true ,
                "teacher name ": teacher.username,
                "teacher email ": teacher.email,
                "teacher id ": teacher._id,
                "teacher students":mappedStudent}) 
            }
    }catch (error) {
        res.status(500).send({
            status: 500,
            message: "server error " + error.message
        })
    }
}
module.exports = {
    set_student_mark,
    start_session,
    view_students,
    end_session,
    session_students,
    view_teacher_info
}