const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { status } = require("express/lib/response"); /*****/ 
const teacherSchema= new  mongoose.Schema({
  username: {
    type : String ,
    required: true ,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  students:[
    {
  type: mongoose.Types.ObjectId,
  ref: "students",
    },
  ],

})
teacherSchema.pre("save",async function(next){
  this.password = await bcrypt.hash(this.password,10)
  next()
})
module.exports = mongoose.model("teachers", teacherSchema);