import { useNavigate } from "react-router-dom";

function getItem(label, key, path, children, isChild) {
  let navigate = useNavigate();
  return {
    key,
    children,
    label,
    onClick: isChild
      ? () => {
          navigate(path, {
            state: {
              menuItem: key,
            },
          });
        }
      : null,
  };
}

export function getUserActions(courseId) {
  let insActions = [
    getItem("Instructor Actions", "insActions", "instructionActions", [
      getItem("Courses", "manageCourses", "/ins/manageCourses", "", true),
      getItem("Projects", "manageProjects", "/ins/manageProjects", "", true),
      getItem("Students", "manageStudents", "/ins/manageStudents", "", true),
      getItem("Users", "manageUsers", "/ins/manageUsers", "", true),
      getItem("Clients", "manageClients", "/ins/manageClients", "", true),
      // getItem("Judges", "manageJudges", "/ins/manageJudges", "", true),
      getItem("Emails ", "emails", "", [
        getItem("New Email", "sendEmail", "/ins/sendEmail", "", true),
        getItem("Email Logs", "emailLogs", "/ins/emailLogs", "", true),
        getItem(
          "Email Templates",
          "emailTemplates",
          "/ins/emailTemplates",
          "",
          true
        ),
      ]),
      getItem("Events ", "manageEvent", "", [
        getItem("Events", "events", "/ins/events", "", true),
        getItem("Sponsors", "sponsor", "/refdata/sponsor", "", true),
        getItem(
          "Scoring Category",
          "scoring_categories",
          "/refdata/scoring_categories",
          "",
          true
        ),
        getItem(
          "Project Types",
          "project_types",
          "/refdata/project_types",
          "",
          true
        ),
        getItem("Judge", "judge", "/refdata/judge", "", true),
        getItem(
          "Winner Categories",
          "winner_categories",
          "/refdata/winner_categories",
          "",
          true
        ),
      ]),
    ]),
  ];

  let clientActions = [
    getItem("Client Actions", "clientActions", "", [
      getItem(
        "Projects",
        "manageClientProjects",
        "/client/manageClientProjects",
        "",
        true
      ),
    ]),
  ];

  let studentActions = [
    getItem("Student Actions", "studentActions", "", [
      getItem("Courses", "courses", "/student/courses", "", true),
      getItem("Projects", "projects", `/course/projects/${courseId}`, "", true),
      getItem("My Project", "myProject", "/student/myProject", "", true),
    ]),
  ];

  let judgeActions = [
    getItem("Judge Actions", "judgeActions", "", [
      getItem("Projects", "projects", "/judge", "", true),
      getItem("Public Dashboard", "publicDashboard", "public/events", "", true),
      getItem(
        "Public DashBoard Events",
        "publicDashBoardEventsById",
        "public/events/" + localStorage.getItem("eventId"),
        "",
        true
      ),
    ]),
  ];

  return { getItem, insActions, clientActions, studentActions, judgeActions };
}
