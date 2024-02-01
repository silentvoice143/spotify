import getToken from "./getToken";

const baseURL = "http://localhost:8000";

const makeUnauthenticatedPOSTRequest = async (route, body) => {
  const response = await fetch(baseURL + route, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = response.clone();
  const data2 = await data.json();
  // console.log(data2);
  return data2;
};

const makeAuthenticatedPOSTRequest = async (route, body) => {
  const token = getToken();
  // console.log(body);
  const response = await fetch(baseURL + route, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(body),
  });
  const data = response.clone();
  const data2 = await data.json();
  // console.log(data2);
  return data2;
};

const makeAuthenticatedPUTRequest = async (route, body) => {
  const token = getToken();
  // console.log(body);
  const response = await fetch(baseURL + route, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(body),
  });
  const data = response.clone();
  const data2 = await data.json();
  // console.log(data2);
  return data2;
};

const makeAuthenticatedGETRequest = async (route) => {
  const token = getToken();
  const response = await fetch(baseURL + route, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
  const data = response.clone();
  const data2 = await data.json();

  return data2;
};

const makeAuthenticatedDELETERequest = async (route) => {
  const token = getToken();
  // console.log(token);
  const response = await fetch(baseURL + route, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
  const data = response.clone();
  const data2 = await data.json();

  return data2;
};

export {
  makeUnauthenticatedPOSTRequest,
  makeAuthenticatedPOSTRequest,
  makeAuthenticatedGETRequest,
  makeAuthenticatedPUTRequest,
  makeAuthenticatedDELETERequest,
};
