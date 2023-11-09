import React, { useEffect, useState } from "react";
import ClientProjectsTable from "../Components/Clients/ClientProjectsTable";
import ProjectDetails from "../Components/Common/ProjectDetails";
import ProjectForm from "../Components/Clients/ProjectForm";

export const ClientContext = React.createContext();

export const ClientProvider = ({ children }) => {
  const [currentView, setCurrentView] = useState("manageProjects");

  const loadView = (viewName, viewId) => {
    console.log("called load view", viewName);
    setCurrentViewComponent(getView(viewName, viewId));
    setCurrentView(viewName);
  };
  //switch view
  const getView = (viewName, viewId) => {
    switch (viewName) {
      case "manageProjects":
        return <ClientProjectsTable />;
      case "projectDetails":
        return <ProjectDetails projectId={viewId} loadView={loadView} />;
      case "editForm":
        return <ProjectForm title={viewId} formType={viewName} />;
      case "extendForm":
        return <ProjectForm title={viewId} formType={viewName} />;
      case "createForm":
        return <ProjectForm title={viewId} formType={viewName} />;
    }
  };

  const [currentViewComponent, setCurrentViewComponent] = useState(
    getView(currentView)
  );
  useEffect(() => {}, []);

  return (
    <ClientContext.Provider
      value={{ currentView, currentViewComponent, loadView }}
    >
      {children}
    </ClientContext.Provider>
  );
};
