const mongoose = require("mongoose");
const requestSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "students",
    required: true,
  },
  teacherEmail: {
    type: String,
    ref: "teachers",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "denied"],
    default: "pending",
  },
});

module.exports = mongoose.model("requests", requestSchema);