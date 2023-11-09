/* eslint-disable */

import axios from "axios";

export const getAllProjects = async (queryString) => {
  let statusCode = null;
  let msg = null;
  let result = null;
  let path = "/api/v1/project";
  if (queryString) {
    path = "/api/v1/project" + `${queryString}`;
  }
  await fetch(process.env.REACT_APP_LOCAL_DB_URL + path, {
    method: "GET",
    mode: "cors",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      "Access-Token": localStorage.getItem("access_token"),
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      //console.log(data);
      if (
        data.response_data.hasOwnProperty("my_projects") &&
        data.response_data.hasOwnProperty("ongoing_projects")
      ) {
        statusCode = 200;
        msg = data.response_str;
        result = data.response_data;
      } else {
        statusCode = data.status;
        msg = data.message;
        result = data;
      }
    })
    .catch((e) => {
      //console.log("Error - " + e);
    });
  return { status: statusCode, data: result, message: msg };
};

export const getProjectDetailsById = async (id) => {
  let statusCode = null;
  let msg = null;
  let result = null;
  await fetch(
    process.env.REACT_APP_LOCAL_DB_URL +
      "/api/v1/project/" +
      `${id}` +
      "/detail",
    {
      method: "GET",
      mode: "cors",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        "Access-Token": localStorage.getItem("access_token"),
      },
    }
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      //console.log(data);
      if (data.hasOwnProperty("response_data")) {
        statusCode = 200;
        msg = data.response_str;
        result = data.response_data;
      } else {
        statusCode = data.status;
        msg = data.message;
        result = data;
      }
    })
    .catch((e) => {
      //console.log("Error - " + e);
    });
  return { status: statusCode, data: result, message: msg };
};

export const updateProjectDetail = async (values, id) => {
  let statusCode = null;
  let msg = null;
  let result = null;
  const formData = new FormData();
  Object.keys(values).map((key) => {
    formData.set(key, values[key]);
  });
  await fetch(
    process.env.REACT_APP_LOCAL_DB_URL + "/api/v1/project/" + `${id}`,
    {
      method: "PUT",
      mode: "cors",
      body: formData,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Token": localStorage.getItem("access_token"),
      },
    }
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      //console.log(data);
      if (data.hasOwnProperty("response_data")) {
        statusCode = 200;
        msg = data.response_str;
        result = data.response_data;
      } else {
        statusCode = 400;
        msg = data.error.message;
        result = data;
      }
    })
    .catch((e) => {
      //console.log("Error - " + e);
    });
  return { status: statusCode, data: result, message: msg };
};

export const addNewProject = async (values) => {
  let statusCode = null;
  let msg = null;
  let result = null;
  const formData = new FormData();
  Object.keys(values).map((key) => {
    if (key === "attachments" && values[key] != undefined) {
      values[key].map((ele, index) => {
        formData.append(key, values[key][index].originFileObj);
      });
    } else formData.append(key, values[key]);
  });
  await fetch(process.env.REACT_APP_LOCAL_DB_URL + "/api/v1/project", {
    method: "POST",
    mode: "cors",
    body: formData,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Token": localStorage.getItem("access_token"),
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      //console.log(data);
      if (data.hasOwnProperty("response_data")) {
        statusCode = 200;
        msg = data.response_str;
        result = data.response_data;
      } else {
        statusCode = 400;
        msg = data.error.message;
        result = data;
      }
    })
    .catch((e) => {
      //console.log("Error - " + e);
    });
  return { status: statusCode, data: result, message: msg };
};

export const uploadProjectFiles = async (values, id) => {
  let statusCode = null;
  let msg = null;
  let result = null;
  const formData = new FormData();
  Object.keys(values).map((key) => {
    if (key === "content") {
      values[key].map((ele, index) => {
        formData.append(key, values[key][index].originFileObj);
      });
    } else formData.append(key, values[key]);
  });
  await fetch(
    process.env.REACT_APP_LOCAL_DB_URL +
      "/api/v1/project/" +
      `${id}` +
      "/upload-content",
    {
      method: "POST",
      mode: "cors",
      body: formData,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Token": localStorage.getItem("access_token"),
      },
    }
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      //console.log(data);
      if (data.hasOwnProperty("response_data")) {
        statusCode = 200;
        msg = data.response_str;
        result = data.response_data;
      } else {
        statusCode = 400;
        msg = data.error.message;
        result = data;
      }
    })
    .catch((e) => {
      //console.log("Error - " + e);
    });
  return { status: statusCode, data: result, message: msg };
};
