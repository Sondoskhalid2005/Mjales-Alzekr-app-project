const bcrypt = require("bcrypt");
const teachers = require("../modules/teachers.modules")
const students = require("../modules/students.modules")
const jwt = require("jsonwebtoken")
const expireDate= 3*24*60*60;

// token method

const creatToken=(userId)=>{
    return jwt.sign({ userId }, "secret", {expiresIn: expireDate,})}
//signin
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

/******/ 
        const authUser = await bcrypt.compare(password,user.password);
          if(!authUser){
            return res.status(400).send( 
                {
                status:400 ,
                message: "wrong password"
                }) ;
           } 

        const token = creatToken(user._id);
/******/ res.cookie("token", token, { httpOnly: true, maxAge: expireDate * 1000 });
        return res.status(200).send( 
            {
            success : true ,
            msg: "signed in seccessfully !" + "welcome " + user.username + " ! ", 
            data: user
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
        console.log("Signup route hit!");
        const {type ,username , email , password} = req.body;
        const bcryptt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, bcryptt);

        if (type==="teacher"){
        const newTeacher= new teachers({username , email , password : hashedPassword , available :false});
        await newTeacher.save();

        return res.status(201).send( 
            {
            success : true ,
            message: "teacher registered successfully!" ,
            userData: newTeacher
            })     
         }
         else if(type==="student"){
            const newStudent= new students({username , email , password : hashedPassword });
            await newStudent.save(); 
              
            return res.status(201).send( 
                {
                success : true ,
                message: "student registered successfully!" ,
                userData: newStudent
                }) 
        }
    }
    catch(error){
        res.status(500).send( 
            {
            status:500 ,
            message: "server error" + error.message
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
            message: "server error"
            })
    }
}
 module.exports={signIn,signUp,signOut} ;                   
                           
