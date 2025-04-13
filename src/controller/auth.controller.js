const bcrypt = require("bcryptjs");
const teachers = require("../modules/teachers.modules")
const students = require("../modules/students.modules")
const jwt = require("jsonwebtoken")
const expireDate= 3*24*60*60;

// token method
const createToken=(userId)=>{
    return jwt.sign({ userId }, "secret", {expiresIn: expireDate,})}
//signIn
const signIn =async(req,res)=>{
    try{
        const { email , password} = req.body;
        const [teacher , student] = await Promise.all([ //excutes queries at the same time
            teachers.findOne({email}) ,
            students.findOne({email}) 
        ]);
        
        const user = teacher || student ;
        if(!user){
            return res.status(404).send({
               success: false , msg : "user not found !" })
                 }

        const authUser =  bcrypt.compare(req.body.password,user.password);
          if(!authUser){
            return res.status(400).send( 
                {
                status:400 ,
                message: "wrong password"
                }) ;
           } 

        const token = createToken(user._id);
        res.cookie("token", token, { httpOnly: true, maxAge: expireDate * 1000 });
        return res.status(200).send( 
            {
            success : true ,
            msg: "signed in seccessfully ! " + "welcome " + user.username + " ! ", 
           "name": user.username,
            "email": user.email,
            "id": user._id,
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
//signup
const signUp=async(req,res)=>{
    try{
        
        const {role ,username , email , password} = req.body;
        const bcryptt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, bcryptt);

        if (role==="teacher"){
        const newTeacher= new teachers({username , email , password : hashedPassword , available :false});
        await newTeacher.save();

        return res.status(201).send( 
            {
            success : true ,
            message: "teacher registered successfully!" ,
            "teacher name": newTeacher.username,
            "teacher email": newTeacher.email,
            "teacher id": newTeacher._id,
            })     
         }
         else if(role==="student"){
         
            let teacher = await teachers.find(); //return all teacher 
            let filteredTeachers =teacher.filter(teach=>{return teach.students.length!==5})
            if(filteredTeachers.length==0){
                return res.status(404).send({ 
                success : false , message:"registration failed, no available teachers to add you in their group !" })
            }
            const teacherFound=filteredTeachers[0];
            const newStudent= new students({username , email , password : hashedPassword , teacherId:teacherFound._id,available:false,mark:0 });
            await teachers.findByIdAndUpdate(teacherFound._id, { $push: { students: newStudent._id } });
            teacherFound.students.push(newStudent._id)
            await newStudent.save(); 
              
            return res.status(201).send( 
                {
                success : true ,
                message: "student registered successfully!" ,
                "student name": newStudent.username,
                "student id": newStudent._id,
                "teacher student": newStudent.student,
                "students teacher": teacherFound.username
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
//signout
const signOut = async (req,res)=>{
    try{
        res.cookie("token", "", { maxAge: 1 });
        return res.status(200).send( 
            {
            success:true ,
            message: "user signed out seccessfully"
            });
    }
    catch(error){
        res.status(500).send( 
            {
            status:500 ,
            message: "server error "
            })
    }
}
 module.exports={signIn,signUp,signOut} ;                   
                           
