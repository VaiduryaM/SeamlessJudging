/* eslint-disable */
export const joinProjectById = async (values) => {
  let statusCode = null;
  let msg = null;
  let result = null;
  let id = values.projectId
  await fetch(
    process.env.REACT_APP_LOCAL_DB_URL + "/api/v1/project/" + `${id}` + "/enroll",
    {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(values),
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
      if (data.hasOwnProperty("error")) {
        statusCode = 400;
        msg = data.error.message;
        result = data.error;
      } else {
        statusCode = 200;
        msg = data.response_str;
        result = data.response_data;
      }
    })
    .catch((e) => {
      //console.log("Error - " + e);
      statusCode = 400;
      msg = e.message;
      result = e.code;
    });
  return { status: statusCode, data: result, message: msg };
};

export const requestProjectById = async (id, payload) => {
  let statusCode = null;
  let msg = null;
  let result = null;
  await fetch(
    process.env.REACT_APP_LOCAL_DB_URL +
      "/api/v1/request/" +
      `${id}` +
      "/request",
    {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(payload),
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
      if (data.hasOwnProperty("response_str")) {
        statusCode = 200;
        msg = data.response_str;
        result = data.response_data;
      } else {
        statusCode = 400;
        msg = data.error.message;
        result = null;
      }
    })
    .catch((e) => {
      //console.log("Error - " + e);
      statusCode = 400;
      msg = e.message;
    });
  return { status: statusCode, data: result, message: msg };
};

export const signUp = async (values) => {
  let statusCode = null;
  let msg = null;
  let result = null;
  const formBody = new FormData();
  Object.keys(values).map((key) => {
    formBody.append(key, values[key]);
  });
  await fetch(process.env.REACT_APP_LOCAL_DB_URL + "/api/v1/user/signup", {
    method: "POST",
    mode: "cors",
    body: formBody,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      //console.log(data);
      if (
        data.hasOwnProperty("response_str") &&
        data.hasOwnProperty("response_data")
      ) {
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

export const getUserProfile = async () => {
  let statusCode = null;
  let msg = null;
  let result = null;
  await fetch(process.env.REACT_APP_LOCAL_DB_URL + "/api/v1/user/profile", {
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

export const updateProfile = async (values) => {
  let statusCode = null;
  let msg = null;
  let result = null;
  const formBody = new FormData();

  Object.keys(values).map((key) => {
    //console.log(values, key);
    formBody.append(key, values[key]);
  });
  await fetch(process.env.REACT_APP_LOCAL_DB_URL + "/api/v1/user/profile", {
    method: "PUT",
    mode: "cors",
    body: formBody,
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
      if (
        data.hasOwnProperty("response_str") &&
        data.hasOwnProperty("response_data")
      ) {
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
