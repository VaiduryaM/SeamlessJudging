/* eslint-disable */
import React, { createContext, useContext, useEffect, useState } from "react";
import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Appbar from "./Components/Main/Appbar/Appbar";
import {
  Affix,
  Avatar,
  Card,
  Col,
  DatePicker,
  Image,
  Layout,
  List,
  Row,
  Select,
  Space,
} from "antd";
import { SettingTwoTone, StarTwoTone, TrophyTwoTone } from "@ant-design/icons";
import ErrorPage from "./Components/Common/ErrorPage";
import SideBar from "./Components/Common/Pages/SideBar";
import UpdateProfile from "./Components/Common/UpdateProfile";
import Profile from "./Components/Common/Profile";
import {
  InstructorContext,
  InstructorProvider,
} from "./Context/InstructorContext";
import InsProjectsTable from "./Components/Instructor/InsProjectTable";
import Courses from "./Components/Students/Courses";
import InsCourses from "./Components/Instructor/InsCourses";
import ClientProjectsTable from "./Components/Clients/ClientProjectsTable";
import InsClientTable from "./Components/Instructor/InsClientTable";
import InsUserTable from "./Components/Instructor/InsUserTable";
import NewEmailForm from "./Components/Instructor/Emails/NewEmail";
import EmailLog from "./Components/Instructor/Emails/EmailLog";
import EmailTemplates from "./Components/Instructor/Emails/ManageEmailTemplates";
import InsAddUsers from "./Components/Instructor/InsAddUsers";
import ProjectForm from "./Components/Common/ProjectForm";
import EmailTemplateForm from "./Components/Instructor/Emails/EmailTemplateForm";
import Projects from "./Components/Students/Projects";
import ProjectEnrollment from "./Components/Students/ProjectEnrollment";
import ProjectDetails from "./Components/Common/ProjectDetails";
import UserDetails from "./Components/Instructor/UserDetails";
import InsCliProjectDetails from "./Components/Common/InsCliProjectDetails";
import ProjectHistory from "./Components/Common/ProjectHistory";
import AddProjectForm from "./Components/Common/AddProjectForm";
import AddBulkProjects from "./Components/Common/AddBulkProjects";
import InsStudentAllocation from "./Components/Instructor/InsStudentAllocation";
import ProjectNotes from "./Components/Instructor/ProjectNotes";
import { MainContext } from "./Context/MainContext";
import InsEventsTable from "./Components/Instructor/Events/InsEventsTable";
import AdminAddEvent from "./Components/Instructor/Events/AdminAddEvent";
import ViewEventById from "./Components/Instructor/Events/ViewEventById";
import ViewReferenceData from "./Components/Instructor/ReferenceData/ViewReferenceData";
import JudgeProjectsDashBoard from "./Components/Judges/Projects/JudgeProjectsDashBoard";
import PublicDashBoard from "../src/Components/Public/PublicDashBoard";
import PublicDashBoardEventsById from "../src/Components/Public/PublicDashBoardEventsById";

const { Content } = Layout;
import { useNavigate } from "react-router-dom";
const authDetailsContext = createContext();

const App = () => {
  const [authDetails, setAuthDetails] = useState({
    isAuthenticated: false,
    role: "",
  });

  const { isLoggedIn,setIsLoggedIn } = useContext(MainContext);
  const navigate = useNavigate();
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showParticipantLogin, setShowParticipantLogin] = useState(false);
  const [showJudgeLogin, setShowJudgeLogin] = useState(false);
  const [notificationNumber, setNotificationNumber] = useState(null);
  const [appRefresh, setAppRefresh] = useState(false);
  const [role, setRole] = useState("");

  //location
  const location = useLocation();

  //setting active menu items
  const [activeMenuItem, setActiveMenuItem] = useState({});

  const authProps = {
    authDetails,
    setAuthDetails,
    notificationNumber,
    setNotificationNumber,
    appRefresh,
    setAppRefresh,
  };
  const adminProps = {
    showAdminLogin,
    setShowAdminLogin,
    authDetails,
    setAuthDetails,
  };
  const participantProps = {
    authDetails,
    setAuthDetails,
    showParticipantLogin,
    setShowParticipantLogin,
  };
  const judgeProps = {
    authDetails,
    setAuthDetails,
    showJudgeLogin,
    setShowJudgeLogin,
  };
  const refreshToken = async () => {
    await fetch(
      process.env.REACT_APP_LOCAL_DB_URL +
        "/api/v1/user/refresh-token" +
        `?refresh_token=${localStorage.getItem("refresh_token")}`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (response.ok) return response.json();
        else return response;
      })
      .then((data) => {
        if (
          data.response_data.hasOwnProperty("access_token") &&
          data.response_data.hasOwnProperty("refresh_token")
        ) {
          localStorage.setItem("access_token", data.response_data.access_token);
          localStorage.setItem(
            "refresh_token",
            data.response_data.refresh_token
          );
          setAuthDetails({
            isAuthenticated: true,
            role: data.response_data.role,
          });
        } else {
          setAuthDetails({ isAuthenticated: false, role: "" });
        }
      })
      .catch((e) => {
        //console.log("Error - " + e);
      });
  };
  const decodeJWT = (access_token) => {
    if (access_token) {
      return JSON.parse(atob(access_token.split(".")[1]));
    } else {
      return null;
    }
  };
  useEffect(() => {
    refreshToken();
    const roles = JSON.parse(localStorage.getItem("roles"));
    if (roles) {
      let splitRoute = location.pathname.split("/");
      let parent = splitRoute[1];
      let item = splitRoute[2];
      if (roles.includes("INSTRUCTOR")) {
        if (location.pathname.includes("home")) {
          setActiveMenuItem({
            name: "manageCourses",
            parent: "insActions",
          });
          setRole(<InsCourses />);
        } else {
          setActiveMenuItem({
            name: item,
            parent: parent + "Actions",
          });
        }
      } else if (roles.includes("CLIENT")) {
        if (location.pathname.includes("home")) {
          setActiveMenuItem({
            name: "manageClientProjects",
            parent: "clientActions",
          });
          setRole(<ClientProjectsTable />);
        } else {
          setActiveMenuItem({
            name: item,
            parent: parent + "Actions",
          });
        }
      } else if (roles.includes("STUDENT")) {
        if (location.pathname.includes("home")) {
          setActiveMenuItem({
            name: "courses",
            parent: "studentActions",
          });
          setRole(<Courses />);
        } else {
          setActiveMenuItem({
            name: item,
            parent: parent + "Actions",
          });
        }
      } else if (roles.includes("JUDGE")) {
        if (location.pathname.includes("home")) {
          setActiveMenuItem({
            name: "projects",
            parent: "judgeActions",
          });
          setRole(<JudgeProjectsDashBoard />);
        } else {
          if (parent === "judge") {
            setActiveMenuItem({
              name: "projects",
              parent: "judge" + "Actions",
            });
          } else if (parent === "public" && splitRoute.length == 3) {
            setActiveMenuItem({
              name: "publicDashboard",
              parent: "judge" + "Actions",
            });
          } else {
            setActiveMenuItem({
              name: "publicDashBoardEventsById",
              parent: "judge" + "Actions",
            });
          }
        }
      }
    }

    const interval = setInterval(() => {
      const decoder = decodeJWT(localStorage.getItem("access_token"));
      if (decoder && decoder.exp * 1000 < Date.now()) {
        refreshToken();
        if(location.pathname!='/login')
        {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token'); 
        localStorage.removeItem('roles');
        localStorage.removeItem('email');
        setIsLoggedIn(false);
        navigate("/login");
        }
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [location.pathname]);

  const onCardClick = (id) => {
    switch (id) {
      case "admin":
        setShowAdminLogin(true);
        break;
      case "student":
        setShowParticipantLogin(true);
        break;
      case "judge":
        setShowJudgeLogin(true);
        break;
    }
  };

  const accessToken = !localStorage.getItem("access_token") ? false : true;

  return (
    <authDetailsContext.Provider value={authProps}>
      <InstructorProvider>
        {(isLoggedIn || accessToken) && (
          <>
            <Appbar activeItem={activeMenuItem}/>
            <Layout>
              <SideBar activeItem={activeMenuItem} />
              <Layout>
                <Content
                  style={{
                    padding: "20px 24px 24px",
                  }}
                >
                  <Routes>
                    {role && <Route path="/home" element={role} />}

                    {/*------------------- Instructor routes-------------------- */}
                    <Route
                      path="/ins/manageProjects"
                      name="manageProjects"
                      element={<InsProjectsTable />}
                    />
                    <Route path="/ins/manageCourses" element={<InsCourses />} />
                    <Route
                      path="/ins/manageClients"
                      element={<InsClientTable />}
                    />
                    <Route
                      path="/ins/manageStudents"
                      element={<InsStudentAllocation />}
                    />
                    <Route path="/ins/manageUsers" element={<InsUserTable />} />

                    <Route path="/ins/sendEmail" element={<NewEmailForm />} />
                    <Route path="/ins/emailLogs" element={<EmailLog />} />
                    <Route
                      path="/ins/emailTemplates"
                      element={<EmailTemplates />}
                    />
                    <Route
                      path="/ins/emailTemplate"
                      element={<EmailTemplateForm />}
                    />
                    <Route path="/ins/addUser" element={<InsAddUsers />} />
                    <Route path="/ins/notes" element={<ProjectNotes />} />
                    <Route
                      path="/ins/project/add"
                      element={<AddProjectForm />}
                    />
                    <Route
                      path="/ins/project/addbulk"
                      element={<AddBulkProjects />}
                    />

                    <Route path="/ins/events" element={<InsEventsTable />} />

                    <Route path="/ins/event/view" element={<ViewEventById />} />

                    <Route path="/ins/events/add" element={<AdminAddEvent />} />
                    <Route
                      path="/ins/project/update"
                      element={<ProjectForm />}
                    />

                    <Route
                      path="/client/manageClientProjects"
                      element={<ClientProjectsTable />}
                    />
                    <Route
                      path="refdata/:type"
                      element={<ViewReferenceData />}
                    />

                    {/* ---------Judge related routes -------------------*/}

                    <Route path="/judge" element={<JudgeProjectsDashBoard />} />
                    <Route path="public/events" element={<PublicDashBoard />} />
                    <Route
                      path="public/events/:ID"
                      element={<PublicDashBoardEventsById />}
                    />
                    <Route path="*" element={<ErrorPage role="JUDGE" />} />

                    <Route
                      path="/project/details"
                      element={<ProjectDetails />}
                    />
                    <Route
                      path="/project/insclidetails"
                      element={<InsCliProjectDetails />}
                    />
                    <Route
                      path="/user/userdetails"
                      element={<UserDetails />}
                    />

                    <Route
                      path="/project/lineage"
                      element={<ProjectHistory />}
                    />
                    <Route
                      path="/course/projects/:courseId"
                      element={<Projects />}
                    />
                    <Route
                      path="/project/enroll"
                      element={<ProjectEnrollment />}
                    />

                    {/*-------------------Student routes---------------- */}
                    <Route path="/student/courses" element={<Courses />} />
                    <Route
                      path="/student/projects/:courseId"
                      element={<Projects />}
                    />
                    <Route
                      path="/student/myProject"
                      element={<ProjectDetails />}
                    />
                    {/* <Route
                      path="/student/project/:courseId/enroll"
                      element={<ProjectEnrollment />}
                    /> */}
                    {/* <Route
                      path="/student/project/details"
                      element={<ProjectDetails />}
                    /> */}
                    {/*-------------------- Profile routes--------------------- */}
                    <Route path="/updateProfile" element={<UpdateProfile />} />
                    <Route path="/profile" element={<Profile />} />
                    {/*-------------------- Client routes--------------------- */}
                    <Route
                      path="/client/project/add"
                      element={<AddProjectForm />}
                    />
                    <Route
                      path="/client/project/update"
                      element={<ProjectForm />}
                    />
                    <Route
                      path="client/manageClientProjects"
                      element={<ClientProjectsTable />}
                    />
                    {/*-------------------- Misc routes--------------------- */}
                    <Route path="*" element={<ErrorPage />} />
                  </Routes>
                </Content>
              </Layout>
            </Layout>
          </>
        )}
      </InstructorProvider>
    </authDetailsContext.Provider>
  );
};
export { authDetailsContext };
export default App;
