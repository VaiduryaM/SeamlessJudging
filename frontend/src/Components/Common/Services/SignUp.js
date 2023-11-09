export const SignUpService = async (values) => {
    let statusCode = null;
    let msg = null;
    let result = null;
    await fetch(process.env.REACT_APP_LOCAL_DB_URL + "/api/v1/user/signup", {
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
                localStorage.setItem("userId", data.response_data.user_id);
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
