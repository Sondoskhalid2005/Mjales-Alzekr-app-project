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
module.exports={checker};