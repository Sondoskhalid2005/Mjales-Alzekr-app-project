const mongoose = require("mongoose"); 
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

  module.exports = mongoose.model("sessions", sessionSchema);