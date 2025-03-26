const teachers = require("../modules/teachers.modules");
const students = require("../modules/students.modules");
const sessions = require("../modules/sessions.module")
const mongoose= require("mongoose");

// set_student_marks
const set_student_marks =async(req,res)=>{
    try{
        const studentid=req.param.studentid;
        const mark = req.param.mark;
        const teacherid=req.userId;
        console.log(typeof(teacherid),typeof(req.userid));
        await students.findByIdAndUpdate(studentid, { markes: mark , teacherId: teacherid});
        return res.status(201).send({
            "success": true,
            "message": "student mark changed seccessfuly"
        });
     
       }
       catch(error){
        res.status(500).send( 
            {
            status:500 ,
            message: "server error" + error.message
            })
       }
}
// start_session
const start_session=async(req,res)=>{
    try{
    const teacherid=req.userId;
    const sessionname = req.body; //...will see if beter to take seperate attributes in body
    const teacher= await teachers.findById(teacherid);
    if(teacher.available==false){ // means teacher is not in a session so he can start a session
    await teacher.findByIdAndUpdate(teacherid, { available: true });
     }
    const newSession = new sessions({sessionname , teacherId : teacherid})
    await newSession.save();
    await sessions.create(newSession);

    return res.status(201).send({
        "success": true,
        "message": "New Session started , students can join now ! " ,
        "session name": newSession.sessionName ,
        "session teacher": teacher.username ,
    });
}catch(error){
    res.status(500).send( 
        {
        status:500 ,
        message: "server error" + error.message
        })
}

}
// view_students
const view_students=async(req,res)=>{
    try{
    const teacherid=req.userId;
    const teacher= await teachers.findById(teacherid)
    let teacherStudents = students.filter(stud=>stud.teacherId==teacherid)
    console.log(teacherStudents);
    teacherStudents.forEach(stud => {console.log(stud.username && stud._id)})
    return res.status(201).send({
        "success": true,
        "here is your students names and id " :
         teacherStudents.forEach(stud => {stud.username && stud._id}) ,
    });
       }catch(error){
        res.status(500).send( 
            {
            status:500 ,
            message: "server error" + error.message
            })
    }
}

module.exports={set_student_marks, start_session,view_students}















