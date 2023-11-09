const express = require("express");
const app = express();
const fs = require("fs");
const morgan = require("morgan");
const path = require("path");

const userRoutes = require('./api/routes/user');
const projectRoutes = require('./api/routes/project');
const contentRoutes = require('./api/routes/content');
const requestRoutes = require('./api/routes/request');
const eventRoutes = require('./api/routes/event');
const judgeRoutes = require('./api/routes/judge');
const instructorRoutes = require('./api/routes/instructor');
const sponsorRoutes = require('./api/routes/sponsor');
const scorecategoriesRoutes = require('./api/routes/scorecategories');
const winnercategoriesRoutes = require('./api/routes/winnercategories');
const projectTypeRoutes = require('./api/routes/projectType');
const courseCodeRoutes = require('./api/routes/courseCode');
const scoreRoutes = require('./api/routes/score');
const publicRoutes = require('./api/routes/public');
const noteRoutes = require('./api/routes/notes');
const emailTemplateRoutes = require('./api/routes/emailTemplates');
const emailLogRoutes = require('./api/routes/emailLogs'); 
//cors
const cors = require("cors");
app.use(
  cors({
    origin: "*",
    methods: ["GET", "PUT", "DELETE", "UPDATE", "POST"],
  })
);

//static files
app.use(express.static(path.join(__dirname, "/capstone")));
app.use(express.static("db"));
app.use("/images", express.static("db"));
// middlewares ...
app.use(morgan("dev"));

// parse requests of content-type - application/json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    return res.status(200).json({});
  }
  next();
});

if (process.env.DB_MIGRATE === "YES") {
  const db = require("./api/models");
  db.sequelize.sync({ alter: true }).then(() => {
    console.log("Database connection and migration successful!!");
  });
}

// create folder to store all local files...
if (!fs.existsSync(process.env.FILES_UPLOAD_PATH + "/temp")) {
  fs.mkdirSync(process.env.FILES_UPLOAD_PATH + "/temp", { recursive: true });
}

//
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/capstone/index.html"));
});
// app routes ...

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/project', projectRoutes);
app.use('/api/v1/content', contentRoutes);
app.use('/api/v1/request', requestRoutes);
app.use('/api/v1/event', eventRoutes);
app.use('/api/v1/judge', judgeRoutes);
app.use('/api/v1/sponsor',sponsorRoutes);
app.use('/api/v1/scoring-categories',scorecategoriesRoutes);
app.use('/api/v1/winner-categories',winnercategoriesRoutes);
app.use('/api/v1/project-type',projectTypeRoutes);
app.use('/api/v1/course-code',courseCodeRoutes);
app.use('/api/v1/score', scoreRoutes);
app.use('/api/v1/public', publicRoutes);
app.use('/api/v1/instructor', instructorRoutes);
app.use('/api/v1/note', noteRoutes);
app.use('/api/v1/email-templates', emailTemplateRoutes);
app.use('/api/v1/email-logs', emailLogRoutes);


// 404 not found middleware ...
app.use((req, res, next) => {
  const error = new Error("Error: Not found");
  error.status = 404;
  next(error);
});

// 500 error middleware ...
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
