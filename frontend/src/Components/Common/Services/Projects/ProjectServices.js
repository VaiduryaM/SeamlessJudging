const getAPIResponse = async (url, method, body) => {
  let statusCode = null;
  let msg = null;
  let result = null;
  await fetch(url, {
    method: method,
    mode: "cors",
    body: JSON.stringify(body),
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

const getUploadResponse = async (url, method, body) => {
  let res = {};
  console.log("api", url, body);
  await fetch(url, {
    method: method,
    body: body,
    mode: "cors",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Token": localStorage.getItem("access_token"),
    },
  })
    .then((response) => {
      console.log(response);
      res.status = response.status;
      return response.json();
    })
    .then((data) => {
      res.data = data.response_data;
      res.msg = data.response_str;
    })
    .catch((e) => {
      console.log("Error - " + e);
    });
  return res;
};
export { getAPIResponse, getUploadResponse };
