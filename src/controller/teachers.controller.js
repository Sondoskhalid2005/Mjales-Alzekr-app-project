const teachers = require("../modules/teachers.modules");
const students = require("../modules/students.modules");
const sessions = require("../modules/sessions.module")
const mongoose= require("mongoose");

// set_student_mark
const set_student_mark =async(req,res)=>{
    try{
        let {studentid} = req.params;
        const {markk}=req.body;
        studentid=new mongoose.Types.ObjectId(studentid);
        const teacherid=req.userId;
        const student= await students.findById(studentid)
        await students.findByIdAndUpdate(studentid, {mark:markk , teacherId: teacherid });
        return res.status(201).send({
            "success": true,
            "student name": student.username ,
            "message": "student mark changed seccessfuly"
        });
     
       }
       catch(error){
        res.status(500).send( 
            {
            status:500 ,
            message: "server error " + error.message
            })
       }
}
// start_session 
const start_session=async(req,res)=>{
    try{
    const teacherid=req.userId;
    const {sessionname} = req.body; //...will see if beter to take seperate attributes in body
    const teacher= await teachers.findById(teacherid);
    console.log(sessionname ,teacher , teacher.available);
    
    if(teacher.available){ // means teacher in a session and can not be start new session
        return res.status(201).send({"success": false , "msg": "cant make a new session, you are already in a session ! "});
    }else{
     await teachers.findByIdAndUpdate(teacherid ,{ available: true });
    const newSession = new sessions({ sessionName :sessionname , teacherId : teacherid , })
    await sessions.create({sessionName: sessionname, 
        teacherId: teacherid});
    return res.status(201).send({
        "success": true,
        "message": "New Session started , students can join now ! " ,
        "session name": newSession.sessionName ,
        "session teacher": teacher.username ,
    });}
}catch(error){
    res.status(500).send( 
        {
        status:500 ,
        message: "server error " + error.message
        })
}

}
// view_students
const view_students=async(req,res)=>{
    try{
    const teacherid=req.userId;
    const studentlist = await students.find({teacherId:teacherid });
    let mappedStudent=studentlist.map((stud)=>({name:stud.username,id:stud._id, mark:stud.mark }))
    
    return res.status(200).send({
        success: true,
        "students": mappedStudent
    });
       }catch(error){
        res.status(500).send( 
            {
            status:500 ,
            message: "server error " + error.message
            })
    }
}
// end_session
const end_session=async(req,res)=>{
    try{
    const teacherid=req.userId;
    const teacher= await teachers.findById(teacherid);
    
    if(!teacher.available){ 
        return res.status(404).send({"success": false , "msg": "your not in a session to end ! "});
    }else{
     await teachers.findByIdAndUpdate(teacherid ,{ available: false });
     console.log("hi");
     const session= await sessions.find({teacherId:teacherid});
     console.log(session);
     
     await sessions.deleteMany({teacherId: teacherid});

     return res.status(201).send({
        "success": true,
        "message": "session ended succssefully"
    });}
}catch(error){
    res.status(500).send( 
        {
        status:500 ,
        message: "server error " + error.message
        })
}

}
// session_students
const session_students=async(req,res)=>{
    try{
    const teacherid=req.userId;
    const teacher= await teachers.findById(teacherid);
    const session = await sessions.findOne({teacherId: teacher._id});
    if(session){
    const sessionStudentlist =  session.studentsId;
    let allStudents = await students.find(); //return all teacher
    
    let filterdStudent = allStudents.filter(stud=>sessionStudentlist.includes(stud._id)) //
    const mapedStudents = filterdStudent.map(stud=>({id:stud._id, name:stud.username}))
    if(filterdStudent.length==0){
        return res.status(200).send({
            "success": true,
            "students joining your session": "no students joined yet" 
        }); 
    }
     return res.status(200).send({
        "success": true,
        "students joining your session": mapedStudents 
    });}
    else if(!session){
        return res.status(404).send({
            "success": false,
            "students joining your session": "no session started yet to view its students!" 
        })
    }
}
   
catch(error){
    res.status(500).send( 
        {
        status:500 ,
        message: "server error " + error.message
        })
}

}

module.exports={set_student_mark, start_session,view_students, end_session,session_students}















