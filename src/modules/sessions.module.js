const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { status } = require("express/lib/response"); /*****/ 
const sessionSchema= new  mongoose.Schema({
  sessionName: {
    type : String ,
    required: true ,
  },
  teacherId: {
    type: mongoose.Types.ObjectId,
    ref: "teachers" ,
    required: true ,
  },
  studentsId: [{
    type: mongoose.Types.ObjectId,
    ref: "students" ,
  },
]
})
////////////////////////
sessionSchema.pre("save",async function(next){
    this.password = await bcrypt.hash(this.password,10)
    next()
  })
  module.exports = mongoose.model("sessions", sessionSchema);