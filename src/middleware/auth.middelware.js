const jwt = require("jsonwebtoken");
const teachers = require("../modules/teachers.modules")
const students = require("../modules/students.modules")
const mongoose = require("mongoose");

const checker= async(req,res,next)=>{
    try{
        const token = req.cookies.token

        if (!token){
            return res
            .status(401)
            .json({ success: "failed", msg: "Unauthorized , no token provided"});}

            let decodedToken = jwt.verify(token, "secret");
            console.log("Decoded Token:", decoded);
            if (!decoded.userId){
                return res
                  .status(401)
                  .json({ success: false, msg: "Unauthorized ,invalid token"});}
                     
          req.userId = decoded.userId;
          req.userId = new mongoose.Types.ObjectId(req.userId);
           const [teacher , student] = await Promise.all([ 
                      teachers.findById(req.userId) ,
                      students.findById(req.userId)
                  ]);
                  const user = teacher || student ;
                console.log(req.userId)
    if (!user) {
        return res
        .status(404)
        .json({ status: 404, message: "User not found" });
              }

         console.log("Extracted userId:", typeof(req.userId));
          next();
       }catch(error){
        res.status(500).send({
            status: 500 ,
            msg:"server  error" + error.message ,
          })
       }
       
}
const auth=async(req,res)=>{
    try{
    const studentId=req.param.studentId;
    const teacherId=req.userId;
    const teacher= await teachers.findById(teacherId)
    
    const student= await students.findById(studentId)
          if(!student){ // in middleware
              return res.status(400).send({msg:"student is not found" })
          }
          const teachers_student = await teacher.students.findById(studentId)
          if(!teachers_student){ // in middleware
              return res.status(400).send({msg:"student is not in your group , you cant set marks for him" })
          }  
        }catch(error){
            res.status(500).send( 
                {
                status:500 ,
                message: "server error" + error.message
                }) 
        }
}
module.exports={checker , auth};