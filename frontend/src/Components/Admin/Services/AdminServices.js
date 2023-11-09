/* eslint-disable */
export const getRequestsByType = async (type) => {
  let statusCode = null;
  let msg = null;
  let result = null;
  await fetch(
    process.env.REACT_APP_LOCAL_DB_URL + "/api/v1/request?status=" + `${type}`,
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
      if (data.response_data.hasOwnProperty("response")) {
        statusCode = 200;
        msg = data.response_str;
        result = data.response_data.response;
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

export const getRefDataByType = async (type) => {
  let statusCode = null;
  let msg = null;
  let result = null;
  await fetch(process.env.REACT_APP_LOCAL_DB_URL + "/api/v1/" + `${type}`, {
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

export const getRefDataByTypeEventId = async (type, event_id, filter) => {
  let statusCode = null;
  let msg = null;
  let result = null;
  await fetch(
    process.env.REACT_APP_LOCAL_DB_URL +
      "/api/v1/" +
      `${type}` +
      `?event_id=${event_id}&event_filter=${filter}`,
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

export const getProjectsByTypeEventId = async (event_id, filter) => {
  let statusCode = null;
  let msg = null;
  let result = null;
  await fetch(
    process.env.REACT_APP_LOCAL_DB_URL +
      "/api/v1/project" +
      `?event_id=${event_id}&event_filter=${filter}`,
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

export const updateRequestADById = async (id, payload) => {
  let statusCode = null;
  let msg = null;
  let result = null;
  await fetch(
    process.env.REACT_APP_LOCAL_DB_URL + "/api/v1/request/" + `${id}`,
    {
      method: "PUT",
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

export const updateJudgeAccessCode = async (judge_id, event_id) => {
  let statusCode = null;
  let msg = null;
  let result = null;
  await fetch(
    process.env.REACT_APP_LOCAL_DB_URL +
      `/api/v1/judge/${judge_id}/event/${event_id}/code-regenerate`,
    {
      method: "PUT",
      mode: "cors",
      //body: JSON.stringify(payload),
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

export const detachItemsFromEvent = async (values, event_id) => {
  let statusCode = null;
  let msg = null;
  let result = null;

  await fetch(
    process.env.REACT_APP_LOCAL_DB_URL +
      "/api/v1/event/" +
      `${event_id}` +
      "/attach-detach",
    {
      method: "PUT",
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

export const autoAssignJudges = async (values, event_id) => {
  let statusCode = null;
  let msg = null;
  let result = null;

  await fetch(
    process.env.REACT_APP_LOCAL_DB_URL +
      "/api/v1/event/" +
      `${event_id}` +
      "/auto-assign-judges",
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
      if (response.ok) return response.json();
      else return response.json();
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

export const updateRefDataByType = async (payload, type, id) => {
  let statusCode = null;
  let msg = null;
  let result = null;
  let body = JSON.stringify(payload);
  let newFormData = new FormData();
    let formKeys = Object.keys(payload);

    formKeys.forEach((item) => {
      newFormData.append(item, payload[item]);
    });
    let headers = {"Access-Control-Allow-Origin": "*", "Access-Token": localStorage.getItem("access_token"), "Content-Type":"application/json"}

  if(type == "sponsor"){
    let imageField = document.querySelectorAll('#file-upload');
    if(imageField.length > 0){
      delete headers["Content-Type"];
      newFormData.append("logo",imageField[0] && imageField[0].files[0]);
    }
    body = newFormData;
  }
  let path = `/api/v1/${type}/${id}`;
  if (type === "user") path = `/api/v1/${type}/update/${id}`;
  await fetch(process.env.REACT_APP_LOCAL_DB_URL + path, {
    method: "PUT",
    mode: "cors",
    body: body,
    headers: headers,
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

export const addRefDataByType = async (payload, type) => {
  let statusCode = null;
  let msg = null;
  let result = null;
  let body = JSON.stringify(payload);
  let newFormData = new FormData();
    let formKeys = Object.keys(payload);

    formKeys.forEach((item) => {
      newFormData.append(item, payload[item]);
    });
    let headers = {"Access-Control-Allow-Origin": "*", "Access-Token": localStorage.getItem("access_token"), "Content-Type":"application/json"}
  if(type == "sponsor"){
    let imageField = document.querySelectorAll('#file-upload');
    if(imageField.length > 0){
      delete headers["Content-Type"];
      newFormData.append("logo",imageField[0] && imageField[0].files[0]);
    }
    body = newFormData;
  }
  await fetch(process.env.REACT_APP_LOCAL_DB_URL + `/api/v1/${type}`, {
    method: "POST",
    mode: "cors",
    body: body,
    headers: headers,
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

export const deleteReferencedataByType = async (payload, type) => {
  let statusCode = null;
  let msg = null;
  let result = null;
  await fetch(process.env.REACT_APP_LOCAL_DB_URL + `/api/v1/${type}`, {
    method: "DELETE",
    mode: "cors",
    body: JSON.stringify(payload),
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

export const uploadFileAdmin = async (values) => {
  let statusCode = null;
  let msg = null;
  let result = null;
  const formData = new FormData();
  Object.keys(values).map((key) => {
    if (key === "file" && values[key] != undefined) {
      values[key].map((ele, index) => {
        formData.append(key, values[key][index].originFileObj);
      });
    } else formData.append(key, values[key]);
  });
  await fetch(
    process.env.REACT_APP_LOCAL_DB_URL + "/api/v1/content/bulk-upload",
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

export const getFilePath = async (value) => {
  let statusCode = null;
  let msg = null;
  let result = null;
  await fetch(
    process.env.REACT_APP_LOCAL_DB_URL +
      "/api/v1/content/bulk-upload?upload_type=" +
      `${value}`,
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

export const getFilePathByType = async (event_id, type) => {
  let statusCode = null;
  let msg = null;
  let result = null;
  await fetch(
    process.env.REACT_APP_LOCAL_DB_URL +
      `/api/v1/${type}?event_id=${event_id}&event_filter=INCLUDE&download_excel=TRUE`,
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
      if (data.hasOwnProperty("response_data")) {
        statusCode = 200;
        msg = data.response_str;
        result = data;
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

export const getDashboardFilePathById = async (type) => {
  let statusCode = null;
  let msg = null;
  let result = null;
  await fetch(
    process.env.REACT_APP_LOCAL_DB_URL + `/api/v1/${type}?download_excel=TRUE`,
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
      if (data.hasOwnProperty("response_data")) {
        statusCode = 200;
        msg = data.response_str;
        result = data;
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
