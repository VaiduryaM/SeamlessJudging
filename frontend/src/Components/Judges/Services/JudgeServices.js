/* eslint-disable */
export const getJudgingProjectList = async () => {
  let statusCode = null;
  let msg = null;
  let result = null;
  await fetch(process.env.REACT_APP_LOCAL_DB_URL + "/api/v1/judge/projects", {
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

export const postRatingByProjectID = async (data, project_id) => {
  let statusCode = null;
  let msg = null;
  let result = null;
  // const formData = new FormData();
  // Object.keys(values).map((key) => {
  //  formData.append(key, values[key]);
  // });
  await fetch(
    process.env.REACT_APP_LOCAL_DB_URL +
      "/api/v1/score/project/" +
      `${project_id}`,
    {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(data),
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
