const express = require('express');
const app = express();
const mongoose = require("mongoose");

// Correct MongoDB connection string
const MONGO_URI = "mongodb+srv://kca11tita:7OMjztVsmZUUKqov@cluster0.lr72j.mongodb.net/todo-api?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB successfully!"))
  .catch(err => console.log("MongoDB connection error:", err));

const {
  teacherPut,
  teacherPost,
  teacherGet,
  teacherDelete
} = require("./controllers/teachersController.js");

const {
  coursePut,
  coursePost,
  courseGet,
  courseDelete
} = require("./controllers/coursesController.js");

// Parser for request body
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// CORS configuration
const cors = require("cors");
app.use(cors({
  origin: "*",
  methods: "*"
}));

// Middleware de autenticación básica
const basicAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  const [username, password] = credentials.split(':');

  const validUser = "admin";
  const validPassword = "password123";

  if (username === validUser && password === validPassword) {
    return next();
  } else {
    return res.status(403).json({ error: "Forbidden" });
  }
};

// Aplicar autenticación a todas las rutas
app.use(basicAuthMiddleware);

// API routes teachers
app.get("/teachers", teacherGet);
app.post("/teachers", teacherPost);
app.put("/teachers", teacherPut);
app.delete("/teachers", teacherDelete);

// API routes courses
app.get("/courses", courseGet);
app.post("/courses", coursePost);
app.put("/courses", coursePut);
app.delete("/courses", courseDelete);

// Start server
app.listen(3000, () => console.log(`Server running on port 3001!`));