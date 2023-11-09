/* eslint-disable */
export const getAllEvents = async (name) => {
  let statusCode = null;
  let msg = null;
  let result = null;
  let path = "/api/v1/event";
  if (name) {
    path = "/api/v1/event" + `${name}`;
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
        data.response_data.hasOwnProperty("upcoming_events") &&
        data.response_data.hasOwnProperty("past_events")
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

export const addNewEvent = async (values) => {
  let statusCode = null;
  let msg = null;
  let result = null;
  const formBody = new FormData();
  Object.keys(values).map((key) => {
    formBody.append(
      key,
      Array.isArray(values[key]) ? JSON.stringify(values[key]) : values[key]
    );
  });
  await fetch(process.env.REACT_APP_LOCAL_DB_URL + "/api/v1/event", {
    method: "POST",
    mode: "cors",
    body: formBody,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Token": localStorage.getItem("access_token"),
    },
    formData: null,
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
        statusCode = data.status;
        msg = data.error.message;
        result = data;
      }
    })
    .catch((e) => {
      //console.log("Error - " + e);
    });
  return { status: statusCode, data: result, message: msg };
};

export const getEventDetailsById = async (event_id) => {
  let statusCode = null;
  let msg = null;
  let result = null;
  await fetch(
    process.env.REACT_APP_LOCAL_DB_URL + "/api/v1/event/" + `${event_id}`,
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

export const updateEventDetail = async (values, id, momemt) => {
  let statusCode = null;
  let msg = null;
  let result = null;
  const formData = new FormData();
  Object.keys(values).map((key) => {
    if (key == "date") formData.set(key, JSON.stringify(values[key]));
    else formData.set(key, values[key]);
  });
  await fetch(process.env.REACT_APP_LOCAL_DB_URL + "/api/v1/event/" + `${id}`, {
    method: "PUT",
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

export const assignWinnerByProject = async (payload, project_id, event_id) => {
  let statusCode = null;
  let msg = null;
  let result = null;
  await fetch(
    process.env.REACT_APP_LOCAL_DB_URL +
      `/api/v1/project/${project_id}/event/${event_id}/winner`,
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
      if (data.hasOwnProperty("response_data")) {
        statusCode = 200;
        msg = data.response_str;
        result = data.response_data;
      } else {
        if (data.hasOwnProperty("error")) {
          statusCode = 400;
          msg = data.error.message;
          result = null;
        }
      }
    })
    .catch((e) => {
      //console.log("Error - " + e);
    });
  return { status: statusCode, data: result, message: msg };
};

export const updateProjectTableNumber = async (
  payload,
  project_id,
  event_id
) => {
  let statusCode = null;
  let msg = null;
  let result = null;
  await fetch(
    process.env.REACT_APP_LOCAL_DB_URL +
      `/api/v1/project/${project_id}/event/${event_id}`,
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
        result = [];
      }
    })
    .catch((e) => {
      //console.log("Error - " + e);
    });
  return { status: statusCode, data: result, message: msg };
};

export const getProjectEventScores = async (project_id, event_id) => {
  let statusCode = null;
  let msg = null;
  let result = null;
  await fetch(
    process.env.REACT_APP_LOCAL_DB_URL +
      `/api/v1/project/${project_id}/event/${event_id}/scores`,
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
      }
    })
    .catch((e) => {
      //console.log("Error - " + e);
    });
  return { status: statusCode, data: result, message: msg };
};

export const assignJudgesToProject = async (payload, project_id, event_id) => {
  let statusCode = null;
  let msg = null;
  let result = null;
  await fetch(
    process.env.REACT_APP_LOCAL_DB_URL +
      `/api/v1/project/${project_id}/event/${event_id}/assign-judges`,
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

export const unAssignWinnerByEventProject = async (project_id, event_id) => {
  let statusCode = null;
  let msg = null;
  let result = null;
  await fetch(
    process.env.REACT_APP_LOCAL_DB_URL +
      `/api/v1/project/${project_id}/event/${event_id}/winner`,
    {
      method: "DELETE",
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

export const getPublicEventDetailsById = async (event_id) => {
  let statusCode = null;
  let msg = null;
  let result = null;
  let path = `/api/v1/public/event`;
  if (event_id) {
    path = `/api/v1/public/event/${event_id}`;
  }
  await fetch(process.env.REACT_APP_LOCAL_DB_URL + path, {
    method: "GET",
    mode: "cors",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
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
      }
    })
    .catch((e) => {
      //console.log("Error - " + e);
    });
  return { status: statusCode, data: result, message: msg };
};
