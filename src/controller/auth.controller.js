const bcrypt = require("bcrypt");
const teachers = require("../modules/teachers.modules")
const students = require("../modules/students.modules")
const jwt = require("jsonwebtoken")
const expireDate= 3*24*60*60;

// token method

const creatToken=(userId)=>{
    return jwt.sign({ userId }, "secret", {expiresIn: expireDate,})
                           }

const signIn =async(req,res)=>{
    try{
        const { email , password} = req.body;
        const [teacher , student] = await Promise.all([ //excutes queries at the same time
            teachers.findOne({email}) ,
            students.findOne({email}) 
        ]);
        const user = teacher || student;
        if(!user){
            return res.status(404).send({
               success: false , msg : "user not found !" })
                 }

/******/ const authuser=bcrypt.compare(password, user.password)
          if(!authuser){
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
const signup=async(req,res)=>{

}
 module.exports={signIn,signup} ;                   
                           
