export const getRoutes = (apiName, queryParams) => {
  const base = process.env.REACT_APP_LOCAL_DB_URL;
  switch (apiName) {
    case "courses": {
      const { year, semester } = queryParams;
      return base + `/api/v1/course-code?year=${year}&semester=${semester}`;
    }
    case "allProjects": {
      const { courseCodeId } = queryParams;
      return base + `/api/v1/project/${courseCodeId}/projects`;
    }
    case "addProject": {
      return base + `/api/v1/project/add`;
    }
    case "updateProject": {
      return base + `/api/v1/project/update`;
    }
    case "clientProjects": {
      const { clientEmail, semester, year } = queryParams;
      return base + `/api/v1/projects/${semester}/${year}/${clientEmail}`;
    }
    case "projectDetails": {
      const { projectId } = queryParams;
      return base + `/api/v1/project/${projectId}/detail`;
    }
    case "insAllProjects": {
      return base + `/api/v1/project/${"Instructor"}/UserProject`;
    }
    case "enrollProject": {
      const { enrollProjectId } = queryParams;
      return base + `/api/v1/project/${enrollProjectId}/enroll`;
    }
    case "unenrollProject": {
      return base + `/api/v1/project/unenroll`;
    }
    case "allocation": {
      const { enrollProjectId } = queryParams;
      return base + `/api/v1/project/${enrollProjectId}/allocate`;
    }
    case "projectHistory": {
      const { projectId } = queryParams;
      return base + `/api/v1/project/${projectId}/history`;
    }
    case "previewCSV": {
      return base + `/api/v1/user/upload-csv`;
    }
    case "uploadCSV": {
      return base + `/api/v1/user/batch-csv`;
    }
    case "getNote": {
      const { userId } = queryParams;
      return base + `/api/v1/note/`;
    }
    case "addNote": {
      const { userId } = queryParams;
      return base + `/api/v1/note/add`;
    }
    case "deleteNote": {
      const { userId } = queryParams;
      return base + `/api/v1/note/delete`;
    }
    case "updateNote": {
      const { userId } = queryParams;
      return base + `/api/v1/note/update`;
    }
    case "sendNewEmail": {
      return base + `/api/v1/email-templates/sendEmail`;
    }
    case "getEmailLogs": {
      return base + `/api/v1/email-logs/get`;
    }
    case "getEmailTemplates": {
      return base + `/api/v1/email-templates/get`;
    }
    case "addEmailTemplate": {
      return base + `/api/v1/email-templates/add`;
    }
    case "updateEmailTemplate": {
      return base + `/api/v1/email-templates/update`;
    }
    case "deleteEmailTemplate": {
      return base + `/api/v1/email-templates/delete`;
    }
    case "addUser": {
      return base + `/api/v1/user/addUser`;
    }
    case "editRole": {
      return base + `/api/v1/user/edit-role`;
    }
    case "deleteUserProfilePic": {
      return base + `/api/v1/user/deleteUserProfilePic`
    }
    case "editUserProfilePic": {
      return base + `/api/v1/user/editUserProfilePic`
    }
    case "userDetails": {
      const { userId, fromPage } = queryParams;
      return base + `/api/v1/user/${fromPage}/${userId}/detail`;
    }
  }
};
