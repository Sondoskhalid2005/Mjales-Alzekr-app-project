const teachers = require("../modules/teachers.modules");
const students = require("../modules/students.modules");
const sessions = require("../modules/sessions.module");
const requests = require("../modules/sessionsRequests.module");
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
            teacherId: teacher._id, available:true
        })
        if (teacher.available && session) {
            res.status(200).send({
                success: true,
                "message": "your teacher started a session, you can join !",
                "teacher name": teacher.username,
                "session name": session.sessionName
            })
        } else {
            res.status(200).send({
                success: true,
                "teacher name": teacher.username,
                "available": "no available session to join !"
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
        const session = await sessions.findOne({teacherId:teacher._id})
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
                 "message":"session joined successfully !",
                 "teacher name": teacher.username,
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
        const session = await sessions.findOne({teacherId: teacher._id, available:true})
        const outsideSession = await sessions.findOne({ available: true, studentsId: student._id });
        if (!session.studentsId.includes(student._id) && !outsideSession ) {
            res.status(404).send({
                success: false,
                "msg": "no session joined to leave !"
            })
        } if(session.studentsId.includes(student._id)){
            session.studentsId.pull(student._id); // remove the student in session collection
            await students.findByIdAndUpdate(student._id, {available: false})
            await session.save()
            res.status(200).send({
                success: true,
                "session name": session.sessionName,
                "session id ": session._id ,
                "msg": "left the session successfully !"
            })
        } else
        if(outsideSession.studentsId.includes(student._id)){
            outsideSession.studentsId.pull(student._id); // remove the student in session collection
            await students.findByIdAndUpdate(student._id, {available: false})
            await outsideSession.save()
            res.status(200).send({
                success: true,
                "session name": outsideSession.sessionName,
                "session id ": outsideSession._id ,
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
const view_student_profile = async (req, res) => {
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
// send_requests
const session_request = async(req, res) => {
    try {
        const studentid = req.userId;
        const {email} = req.params;
        const request = await requests.findOne({studentId:studentid})
        const student= await students.findById(studentid)
        const teacher= await teachers.findOne({email:email})
        if(!teacher){ 
            return res.status(404).send( 
                {
             success : false ,
             message: "no teacher found with such email ! "
        })
        } 
        if(request){ // check if student has already sent a request
            return res.status(404).send( 
                {
             success : false ,
             message: "you already have pending request , you cant send more requests ! "
        })
        }
        
        if(teacher._id.equals(student.teacherId)){ // check if same teacher as the students teacher
            return res.status(404).send( 
                {
             success : false ,
             message: "cannot send a join request to your teacher, you can join streat away ! "
        })
        }
        if(!teacher.available){ //check if teacher in a session
            return res.status(404).send( 
                {
             success : true ,
           message: "request failed , teacher didnt start an active session yet ! ",
          }) 
        }
        await requests.create({studentId: studentid,teacherEmail: teacher.email}); 
        return res.status(200).send( 
            {
       success : true ,
       message: "request sent successfully, you can join after getting approved ! ",
       "requested teacher": teacher.username,
       "teacher email": teacher.email,
      })
    }catch (error) {
        res.status(500).send({
            status: 500,
            message: "server error " + error.message
        })
    }
}
// view_response
const view_response = async(req, res) => {
    try {
        const studentid = req.userId;
        const request= await requests.findOne({studentId:studentid})
        if(!request){
            return res.status(404).send( 
                {
             success : false ,
             message: "no request sent to view its response ! "
        })  
        }if(request.status=="approved"){
            return res.status(200).send( 
                {
           success : true ,
           "respons": "your request has been approved, you can join now" 
          })
        }
        if(request.status=="pending"){
            return res.status(200).send( 
                {
           success : true ,
           "respons": "your request is still pending, waiting for the teacher to approve it ! " 
          })
        }
        
    }catch (error) {
        res.status(500).send({
            status: 500,
            message: "server error " + error.message
        })
    }
}
// join_outside_session
const join_outside_session = async(req, res) => {
    try {
        const studentid = req.userId;
        const {email}= req.params;
        const teacher= await teachers.findOne({email:email})
        const student= await students.findById(studentid)
        if(!teacher){
            return res.status(404).send( 
                {
             success : false ,
             message: "no teacher with such email !"
        })}

        if(!teacher.available){
            return res.status(404).send( 
                {
             success : false ,
             message: "failed to join , teacher didnt start an active session yet ! "
        }) 
        }
        const request= await requests.findOne({
            studentId:studentid,
            teacherEmail:teacher.email})
            if(!(teacher._id.equals(student.teacherId))){
        if(!request ){
            return res.status(404).send( 
                {
             success : false ,
             message: "failed to join , you should first send a request to join ! "
        })
        }
    }  
        const session= await sessions.findOne({
            teacherId:teacher._id,
             available:true})
        if (teacher._id.equals(student.teacherId) || request.status==="approved") {
            session.studentsId.push(studentid);
            await students.findByIdAndUpdate(studentid, {available: true})
            await session.save()
            await requests.deleteMany({
                studentId: studentid
            })
            return res.status(200).send({
                success: true,
                 "message":"session joined successfully !",
                 "teacher name": teacher.username,
                "sesssion name ": session.sessionName,
            })
        }else{
            return res.status(200).send({
                success: true,
                 "message":"your request didnt get approved yet  !",
            }) 
        }
        
    }catch (error) {
        res.status(500).send({
            status: 500,
            message: "server error " + error.message
        })
    }
} 
// view-teachers
const view_teachers = async (req, res) => {
    try {
        //const teacherid = req.userId;
        const teachersList = await students.find();
        let mappedTeachers= teachersList.map((teacher) => ({
            name: teacher.username,
            email: teacher.email,
            available: teacher.available
             }))
        return res.status(200).send({
            success: true,
            "teachers": mappedTeachers
        });
    } catch (error) {
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
    view_student_profile,
    session_request,
    join_outside_session,
    view_response,
    view_teachers
    
}