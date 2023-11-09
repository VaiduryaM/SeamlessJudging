import React, { useEffect, useState } from "react";
// import InsProjectForm from "../Components/Instructor/InsProjectForm";
import ProjectDetails from "../Components/Common/ProjectDetails";
import InsAddUsers from "../Components/Instructor/InsAddUsers";
import InsClientTable from "../Components/Instructor/InsClientTable";
import InsProjectTable from "../Components/Instructor/InsProjectTable";
import InsUserTable from "../Components/Instructor/InsUserTable";
import InsCourses from "../Components/Instructor/InsCourses";
import EmailLog from "../Components/Instructor/Emails/EmailLog";
import NewEmailForm from "../Components/Instructor/Emails/NewEmail";
// import InsJudgeTable from "../Components/Instructor/InsJudgeTable";
import ProjectNotes from "../Components/Instructor/ProjectNotes";
// import AddProjectForm from "../Components/Instructor/AddProjectForm";
import InsStudentAllocation from "../Components/Instructor/InsStudentAllocation";

export const InstructorContext = React.createContext();

export const InstructorProvider = ({ children }) => {
  const [currentView, setCurrentView] = useState({
    viewName: "manageCourses",
    viewId: 0,
    isMenuItem: false,
    isBreadcrum: false,
  });

  const loadView = (viewName, viewId, isMenuItem, isBreadcrum) => {
    console.log("called load view", viewName);
    setCurrentViewComponent(getView(viewName, viewId));
    setCurrentView({
      ...currentView,
      viewName: viewName,
      viewId: viewId,
      isMenuItem: isMenuItem,
      isBreadcrum: isBreadcrum,
    });
  };

  //switch view
  const getView = (viewName, viewId, addParams) => {
    switch (viewName) {
      case "manageCourses":
        return <InsCourses loadView={loadView} />;
      case "manageProjects":
        return <InsProjectTable courseCodeId={viewId} />;
      case "manageUsers":
        return <InsUserTable />;
      case "newEmail":
        return <NewEmailForm />;
      case "emailLog":
        return <EmailLog />;
      case "manageStudents":
        return <InsStudentAllocation />;
      case "manageClients":
        return <InsClientTable />;
      // case "manageJudges":
      //   return <InsJudgeTable />;
      case "projectDetails":
        return <ProjectDetails projectId={viewId} loadView={loadView} />;
      case "projectForm":
      // return <InsProjectForm title={viewId} formType="add" />;
      case "addUsers":
        return <InsAddUsers />;
      case "notes":
        return <ProjectNotes />;
    }
  };

  const [currentViewComponent, setCurrentViewComponent] = useState(
    getView(currentView.viewName)
  );
  // useEffect(() => {}, []);

  return (
    <InstructorContext.Provider
      value={{ currentView, currentViewComponent, loadView }}
    >
      {children}
    </InstructorContext.Provider>
  );
};
