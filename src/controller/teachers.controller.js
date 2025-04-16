const teachers = require("../modules/teachers.modules");
const students = require("../modules/students.modules");
const sessions = require("../modules/sessions.module");
const requests = require("../modules/sessionsRequests.module");
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
        if(!mark){
            return res.status(404).send({
                "success": false,
                "message": "required the new mark in request body",
            });  
        }else{
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
    }
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
            session_name
        } = req.body; 
        const teacher = await teachers.findById(teacherid);
        if (!session_name) {
            return res.status(404).send({
                success: false,
                msg: "put session name in request body"
            })
        }
        if (teacher.available) { // means teacher in a session and can not start new session
            return res.status(201).send({
                "success": false,
                "msg": "you are already in a session,you cant start a new one ! "
            });
        } else {
            await teachers.findByIdAndUpdate(teacherid, {
                available: true
            });
            const newSession = new sessions({
                sessionName: session_name,
                teacherId: teacherid,
            })
            await sessions.create({
                sessionName: session_name,
                teacherId: teacherid,
                available:true
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
            teacherId: teacher._id, available:true
        }); 
        if (!teacher.available && !session) {
            return res.status(404).send({
                "success": false,
                message: "you didnt start a session to end ! "
            });
        } else {
            await teachers.findByIdAndUpdate(teacherid, {
                available: false
            });
            await students.updateMany(
                { _id: { $in: session.studentsId.map(id => id) } }, // change all students in session availabiliy into false
                { available: false }
              );
              await sessions.findByIdAndUpdate(session._id, {
                available: false
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
            teacherId: teacher._id, available:true
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
const view_teacher_profile = async (req, res) => {
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
// approve-requests 
const manage_requests = async (req, res) => {
    try {
        const teacherid = req.userId;
        const status = req.query.status;
        const teacher= await teachers.findById(teacherid)
        const teacherRequests = await  requests.findOne({teacherEmail:teacher.email})
        if(!teacher.available) 
        {
            return res.status(404).send( 
                {
             success : true ,
            massage : " you cant manage requests befor starting a session !"})
                }
                if(!teacherRequests){
                    return res.status(404).send( 
                        {
                     success : true ,
                    massage : " you have no requests to manage !"})
                        }
                

        if(status==="approved"){ // approve allowed requests
           await  requests.updateMany(
                { teacherEmail: { $in: teacher.email } },
                { $set: { status: "approved" } }
              );   
             // await requests.Save(); 
              return res.status(200).send( 
                {success : true ,
            message:"all your session requests have been approved, students can now join you !"
                   })
                } 

        if(status==="denied"){ // delete denied requests
            await requests.deleteMany({teacherEmail: teacher.email, status:"approved"})
            return res.status(200).send( 
                {success : true ,
            message:"all your session requests have been denied and deleted !"
                   })
        }
            
    }catch (error) {
        res.status(500).send({
            status: 500,
            message: "server error " + error.message
        })
    }
}
// view_requests
const view_requests = async(req, res) => {
    try {
        const teacherid = req.userId;
        const teacher= await teachers.findById(teacherid)
        let allrequests = await requests.find({status:"pending"}); 
        let filterdrequests = allrequests.filter(request => request.teacherEmail==teacher.email) //
           
        if(filterdrequests.length==0){
            return res.status(200).send( 
                {
             success : true ,
             message: "no request sent to view its response ! "
        }) }
        const mapedrequests = filterdrequests.map(request => ({
            requestId: request._id,
            studentId: request.studentId
        }))
            return res.status(200).send( 
                {
             success : true ,
             "requests": mapedrequests
        })  
        
        
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
    view_teacher_profile,
    manage_requests,
    view_requests
    
}