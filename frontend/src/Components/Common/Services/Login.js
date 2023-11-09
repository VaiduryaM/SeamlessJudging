export const LoginService = async (passwordType, values) => {
  let statusCode = null;
  let msg = null;
  let result = null;
  values["passwordType"] = passwordType;
  await fetch(process.env.REACT_APP_LOCAL_DB_URL + "/api/v1/user/login", {
    method: "POST",
    mode: "cors",
    body: JSON.stringify(values),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
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
