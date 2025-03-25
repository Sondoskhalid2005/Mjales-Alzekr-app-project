const express = require("express");
const cookieParser = require("cookie-parser");
const { connectTodb } = require("./database/connectedb.js");

const teachersRouter = require("./routers/teachers.router.js"); 
const studentsRouter = require("./routers/students.routers.js"); 
const authRouter = require("./routers/auth.router.js");

const { checker } = require("../src/middleware/auth.middelware.js");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("*", checker);
app.use("/teachers", teachersRouter);
app.use("/students", studentsRouter);
app.use("/sessions", studentsRouter);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
  connectTodb();
});
