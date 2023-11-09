const moment = require("moment");
const nodeMailer = require("nodemailer");
const fs = require("fs");
const uuid = require("uuid");
const dotenv = require("dotenv").config().parsed;
const excelJS = require("exceljs");
const { resolve } = require("path");
exports.uploadFile = (srcPath, fileType) => {
  fileType = fileType.toLowerCase();
  // if (
  //   ![
  //     ".jpg",
  //     ".jpeg",
  //     ".pdf",
  //     ".png",
  //     ".csv",
  //     ".xlsx",
  //     ".doc",
  //     ".docx",
  //     ".xls",
  //   ].includes(fileType)
  // ) {
  //   fileType = "";
  // }
  let destPath = process.env.FILES_UPLOAD_PATH + "/" + uuid.v4() + fileType;
  fs.rename(srcPath, destPath, () =>
    console.log("File Uploaded Successfully!")
  );
  return destPath;
};

exports.getdefaultValue = (value, def) => {
  return value === undefined || value === "undefined" || !value ? def : value;
};

exports.getprojectType = (value, def) => {
	 console.log(" valueeee  = ");
	 console.log(value);
     return parseInt("3");
};

exports.sendEmail = (subject, body, receiver) => {
  // const transporter = nodeMailer.createTransport({
  // 	service: "gmail",
  // 	auth: {
  // 		type: "OAuth2",
  // 		tls: {
  // 			rejectUnauthorized: false,
  // 		},
  // 		user: dotenv.EMAIL_SENDER,
  // 		clientId: dotenv.GOOGLE_CLIENT_ID,
  // 		clientSecret: dotenv.CLIENT_SECRET,
  // 		refreshToken: dotenv.REFRESH_TOKEN,
  // 	},
  // });
  const transporter = nodeMailer.createTransport({
    host: "hobbes.cse.buffalo.edu",
    port: 587,
    secure: false, // upgrade later with STARTTLS
  });

  let code = (Math.random() + 1).toString(36).substring(7);
  let options = {
    from: dotenv.EMAIL_SENDER,
    to: receiver,
    subject: subject,
    html: body,
  };

  transporter.sendMail(options, function (err, info) {
    if (err) {
      console.log(err);
      return;
    }
    console.log("sent  :", info.response);
  });
};
exports.sendCodeToJudge = (receiver) => {
  const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      tls: {
        rejectUnauthorized: false,
      },
      user: dotenv.EMAIL_SENDER,
      clientId: dotenv.GOOGLE_CLIENT_ID,
      clientSecret: dotenv.CLIENT_SECRET,
      refreshToken: dotenv.REFRESH_TOKEN,
    },
  });

  let code = (Math.random() + 1).toString(36).substring(7);

  let options = {
    from: dotenv.EMAIL_SENDER,
    to: receiver,
    subject: "Event Access Code ",
    text: "Here is your code :" + code,
  };

  transporter.sendMail(options, function (err, info) {
    if (err) {
      console.log(err);
      return;
    }
    console.log("sent  :", info.response);
  });
};

exports.split = (projects, judges, n) => {
  const multiplier = Math.ceil(projects.length / judges.length);
  let copyJudges = [];
  for (let i = 0; i < multiplier * n; i++) {
    copyJudges.push(...judges);
  }

  let projectJudgeMap = {};
  projects.forEach((project, idx) => {
    projectJudgeMap[project.projectId] = {
      project: project,
      judges: [],
    };
    const start = idx * n;
    for (let i = start; i < start + n; i++) {
      projectJudgeMap[project.projectId].judges.push(copyJudges[i]);
    }
  });

  return projectJudgeMap;
};

exports.myRandomInts = (quantity, existing) => {
  const randomInts = [];
  const set = new Set(existing);
  while (set.size < quantity + existing.length) {
    const code = Math.floor(Math.random() * 900000) + 100000;
    if (!set.has(code)) {
      set.add(code);
      randomInts.push(code);
    }
  }
  return randomInts;
};

// TO BE DEPRECATED
exports.getEventMailContent = (event, judge, code) => {
  const eventName = event.name;
  const username = judge.firstName;
  const location = event.location;
  const link = process.env.LINK;
  const startTime = moment(event.startDate)
    .tz("America/New_York")
    .format("dddd, MMMM Do YYYY h:mm A z");
  const endTime = moment(event.endDate)
    .tz("America/New_York")
    .format("dddd, MMMM Do YYYY h:mm A z");
  let content = {};
  content.subject = `Access code for [${eventName}]`;
  content.htmlBody = `
		<!DOCTYPE html>
		<html>
		<head>
		<style>
		table, th, td {
			border: 1px solid black;
			border-collapse: collapse;
		}
		th {
			text-align: left;
		}
		td {
			text-align: right;
		}
		caption {
			text-align: left;
		}
		</style>
		</head>
		<body>

		<p>Hello <b>${username}</b>, <p>
    Welcome to Capstone platform! </b>
    <p>Thank you for judging <b>${eventName}</b>. </p>
    <p>To see the project roaster assigned to you, please follow the link <b>${link}</b> </p>
		<p>Here is your Access Code to login - <b>${code}</b></p>

		</body>
		</html>`;
  return content;
};

// TO BE DEPRECATED
exports.getEmailContentForNewUser = (firstName, role, code) => {
  const username = firstName;
  const link = process.env.LINK;
  let content = {};
  content.subject = `{~User Name~}, your profile has been created on Seamless Judging Portal!`;
  content.htmlBody = `
        <!DOCTYPE html>
        <html>
        <body>
        <p>Hello {~User Name~},<p>
        <p>Your profile has been created!<p>
        <p>To login into the Capstone Project portal.Use this temporary password - <b>{~Token~}</b>.</p>
        <p><b>Note</b> - Later you can update your password using change password option in profile.</p>
        </body>
        </html>`;
  return content;
};

function generateExcel(workbook, worksheet, data) {
  data.forEach((data) => {
    worksheet.addRow(data);
  });
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
  });
  try {
    let destPath =
      process.env.FILES_UPLOAD_PATH + "/temp/" + uuid.v4() + ".csv";
    workbook.csv.writeFile(destPath);
    return destPath;
  } catch (err) {
    return err.message;
  }
}

exports.generateExcelExport = (workbook, worksheet, data) => {
  return generateExcel(workbook, worksheet, data);
};

exports.exportProjectData = (
  ongoingProjects,
  allProjects,
  eventId,
  eventName
) => {
  const workbook = new excelJS.Workbook();
  let worksheet;
  const headers = [
    { header: "Project Name", key: "name", width: 10 },
    { header: "Description", key: "description", width: 10 },
    { header: "Project Type", key: "project_type_name", width: 10 },
    { header: "Course Name", key: "course_code_name", width: 20 },
    { header: "Team", key: "team_list", width: 30 },
    { header: "Judges", key: "judge_list", width: 30 },
  ];
  if (eventId) {
    headers.push({ header: "Table Number", key: "table_number", width: 10 });
    headers.push({ header: "Average Score", key: "avg_score", width: 10 });

    projects = [];
    result = [];
    projects.push(ongoingProjects);
    projects.push(allProjects);
    projects.forEach((obj) => {
      result.push(...obj);
    });
    const sheetName = eventName === null ? "All Projects" : eventName;
    worksheet = workbook.addWorksheet(sheetName);
    worksheet.columns = headers;
    return generateExcel(workbook, worksheet, result);
  } else {
    let destPath;
    if (ongoingProjects.length > 0) {
      const ongoingSheet = "OnGoing Projects";
      const worksheet = workbook.addWorksheet(ongoingSheet);
      worksheet.columns = headers;
      destPath = generateExcel(workbook, worksheet, ongoingProjects);
    }
    if (allProjects.length > 0) {
      destPath = "";
      const allProjectSheet = "All Projects";
      worksheet = workbook.addWorksheet(allProjectSheet);
      worksheet.columns = headers;
      destPath = generateExcel(workbook, worksheet, allProjects);
    }
    return destPath;
  }
};

exports.exportJudgeData = (judges, sheetName) => {
  const workbook = new excelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);
  const headers = [
    { header: "First Name", key: "first_name", width: 10 },
    { header: "Middele Name", key: "middle_name", width: 10 },
    { header: "Last Name", key: "last_name", width: 10 },
    { header: "Email", key: "email", width: 20 },
    { header: "Event", key: "event", width: 30 },
    { header: "code", key: "code", width: 10 },
  ];
  worksheet.columns = headers;
  return generateExcel(workbook, worksheet, judges);
};

exports.studentData = (student) => {
  const workbook = new excelJS.Workbook();
  const studentSheet = workbook.addWorksheet("Students");
  const headers = [
    { header: "First Name", key: "firstName", width: 30 },
    { header: "Middle Name", key: "middleName", width: 30 },
    { header: "Last Name", key: "lastName", width: 30 },
    { header: "Email ID", key: "email", width: 30 },
  ];

  studentSheet.columns = headers;
  let destPath = generateExcel(workbook, studentSheet, student);
  return destPath;
};

exports.instructorData = (instructor) => {
  const workbook = new excelJS.Workbook();
  const instructorSheet = workbook.addWorksheet("Instructor");
  const headers = [
    { header: "First Name", key: "firstName", width: 30 },
    { header: "Middle Name", key: "middleName", width: 30 },
    { header: "Last Name", key: "lastName", width: 30 },
    { header: "Email ID", key: "email", width: 30 },
  ];

  instructorSheet.columns = headers;
  let destPath = generateExcel(workbook, instructorSheet, instructor);
  return destPath;
};

exports.clientData = (client) => {
  const workbook = new excelJS.Workbook();
  const clientSheet = workbook.addWorksheet("Clients");
  const headers = [
    { header: "First Name", key: "firstName", width: 30 },
    { header: "Middle Name", key: "middleName", width: 30 },
    { header: "Last Name", key: "lastName", width: 30 },
    { header: "Email ID", key: "email", width: 30 },
  ];

  clientSheet.columns = headers;
  let destPath = generateExcel(workbook, clientSheet, client);
  return destPath;
};

exports.studentProjectData = (studentProject) => {
  const workbook = new excelJS.Workbook();
  const studentProjectSheet = workbook.addWorksheet(
    "Students Project Allocation"
  );
  const headers = [
    { header: "First Name", key: "firstName", width: 30 },
    { header: "Middle Name", key: "middleName", width: 30 },
    { header: "Last Name", key: "lastName", width: 30 },
    { header: "Email ID", key: "email", width: 30 },
    { header: "Project Description", key: "description", width: 30 },
  ];

  studentProjectSheet.columns = headers;
  let destPath = generateExcel(workbook, studentProjectSheet, studentProject);
  return destPath;
};

exports.exportEventData = (pastEvents, upComingEvents) => {
  const workbook = new excelJS.Workbook();
  const pastEventSheet = workbook.addWorksheet("Past Events");
  const upComingEventSheet = workbook.addWorksheet("Upcoming Events");
  const headers = [
    { header: "Event Name", key: "name", width: 30 },
    { header: "Location", key: "location", width: 20 },
    { header: "Start Date", key: "startDate", width: 20 },
    { header: "Start Time", key: "startTime", width: 20 },
    { header: "End Time", key: "endTime", width: 20 },
    { header: "End Date", key: "endDate", width: 20 },
    { header: "Sponsors", key: "sponsors", width: 30 },
    { header: "Winner Categories", key: "winnerCategory", width: 30 },
  ];

  let destPath;
  if (pastEvents.length > 0) {
    pastEventSheet.columns = headers;
    destPath = generateExcel(workbook, pastEventSheet, pastEvents);
  }
  if (upComingEvents.length > 0) {
    upComingEventSheet.columns = headers;
    destPath = generateExcel(workbook, upComingEventSheet, upComingEvents);
  }
  return destPath;
};

exports.convertExcelSheetToJson = (worksheet) => {
  let jsonData = [];
  let firstRow = worksheet.getRow(1);
  if (!firstRow.cellCount) return jsonData;
  let keys = firstRow.values;
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber == 1) return;
    let values = row.values;
    let obj = {};
    for (let i = 1; i < keys.length; i++) {
      if (typeof values[i] == "object") {
        obj[keys[i]] = values[i].text;
        continue;
      }
      obj[keys[i]] = values[i];
    }
    jsonData.push(obj);
  });
  return jsonData;
};

exports.validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

exports.generateRandomString = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

exports.uploadFileSync = (srcPath, fileType) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      fileType = fileType.toLowerCase();
      let destPath = process.env.FILES_UPLOAD_PATH + "/" + uuid.v4() + fileType;
      fs.rename(srcPath, destPath, () =>
        console.log("File Uploaded Successfully!")
      );
      resolve(destPath);
    }, 1000);
  });
};

exports.getSemester = (datetime) => {
  let semester = "";
  currentMonth = datetime.getMonth();
  let year = String(datetime.getFullYear());

  if (currentMonth >= 0 && currentMonth < 5) semester = "Spring";
  else if (currentMonth >= 4 && currentMonth < 8) semester = "Summer";
  else semester = "Fall";

  return { semester, year };
};

exports.getRolesArray = async (user) => {
  const roleObjs = await user.getRoles();
  const roles = roleObjs.map((role) => role.name);
  return roles;
};

exports.isSubset = (set, superset) => {
  // checks for improper subset
  return set.some((item) => superset.includes(item));
};

exports.generateTokenDetails = () => {
  return {
    tokenNo: this.generateRandomString(12),
    tokenStart: new Date(),
    tokenEnd: new Date(Date.now() + 24 * 60 * 60 * 1000),
  };
};
