const teachers = require("../modules/teachers.modules");
const students = require("../modules/students.modules");
const sessions = require("../modules/sessions.module")
const mongoose= require("mongoose");

// view_mark
const view_mark=async(req,res)=>{
    try{
        const studentid=req.userId;
        const student=await students.findById(studentid); // in  middleware check user exictance
        if(student.mark){
            res.status(200).send({success:true,"mark":student.mark})
        }
        res.status(200).send({success:true,"mark":"no mark set yet"})
       }catch(error){
        res.status(500).send( 
            {
            status:500 ,
            message: "server error " + error.message
            })
    }
}
// view_taecher
const view_teacher=async(req,res)=>{
    try{
        const studentid=req.userId;
        const student=await students.findById(studentid);
        const teacher=await teachers.findById(student.teacherId) 
        console.log(student, teacher, studentid);
         
            res.status(200).send({success:true, "teacher name": teacher.username})
       }catch(error){
        res.status(500).send( 
            {
            status:500 ,
            message: "server error " + error.message
            })
    }
}
// session_to_join
const available_session=async(req,res)=>{
    try{
        const studentid=req.userId;
        const student=await students.findById(studentid);
        const teacher=await teachers.findById(student.teacherId) 
        const session=await sessions.findOne({teacherId:teacher._id})
            if(teacher.available && session){
            res.status(200).send({success:true, "teacher name": teacher.username,
                            "available" : "your teacher started a session, you can join !",
                            "session name": session.sessionName})}
            else{
            res.status(200).send({success:true, "teacher name": teacher.username,
                            "available" : "no available session to joined !"})
                             
        }
       }catch(error){
        res.status(500).send( 
            {
            status:500 ,
            message: "server error " + error.message
            })
    }
}
// join_session
const join_session=async(req,res)=>{
    try{ //dont forget to check if student is already in a session or not to prevent doublicates 
        const studentid=req.userId;
        const student=await students.findById(studentid);
        const teacher=await teachers.findById(student.teacherId) 
        const session=await sessions.findOne({teacherId:teacher._id})
        
            if(teacher.available && session){
            res.status(200).send({success:true, "your joining a session , with teacher" :teacher.username ,
                "sesssion name ": session.sessionName,})
                session.studentsId.push(studentid);
            await session.save()}
            else{
            res.status(200).send({success:true, "teacher name": teacher.username,
                            "available" : "no available session to joined !"})
                             
        }
       }catch(error){
        res.status(500).send( 
            {
            status:500 ,
            message: "server error " + error.message
            })
    }
}
// leave_session
const leave_session=async(req,res)=>{
    try{
        const studentid=req.userId;
        const student=await students.findById(studentid);
        if (!student) {
            console.log(student,studentid , req.userId);
            
            return res.status(404).send({ success: false, msg: "Student not found!" });
        }
        const teacher=await teachers.findById(student.teacherId) 
        const session=await sessions.findOne({teacherId:teacher._id})
        
            if(!teacher.available && !session ){
                res.status(404).send({success:true, "msg":"No active session to leave !"})
             }
            else{
                if(session.studentsId.includes(student._id)){
            session.studentsId.pull(student._id); // remove the student in session collection
            await session.save()
            res.status(200).send({success:true, "session name": session.sessionName , "msg" :"left the session successfully !"})
            }
            else{
                res.status(404).send({success:true, "session name": session.sessionName , "msg" :"no session joined to leave !"})
            }
               
        }
       }catch(error){
        res.status(500).send( 
            {
            status:500 ,
            message: "server error " + error.message
            })
    }
}
module.exports={view_mark,view_teacher, available_session , join_session ,leave_session}