const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { status } = require("express/lib/response"); /*****/ 
const studentSchema= new  mongoose.Schema({
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
  teacherId: {
    type: mongoose.Types.ObjectId,
    ref: "teachers",
    required: true,
  }
})
studentSchema.pre("save",async function(next){
    this.password = await bcrypt.hash(this.password,10)
    next()
  })
  module.exports = mongoose.model("students", studentSchema);