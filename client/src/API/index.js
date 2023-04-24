export const getAuthToken = () =>
  localStorage.getItem("auth_jwt_token") || undefined;
export const setAuthToken = (value) =>
  localStorage.setItem("auth_jwt_token", value);
export const removeAuthToken = () => localStorage.removeItem("auth_jwt_token");
export const getLoggedInAddress = () =>
  localStorage.getItem("auth_logged_in_id");
export const setLoggedInAddress = (value) =>
  localStorage.setItem("auth_logged_in_id", value);
export const removeLoggedInId = () =>
  localStorage.removeItem("auth_logged_in_id");

const addHeaders = (options) => {
  const token = getAuthToken();

  const headers = {
    Authorization: token,
  };
  return {
    ...options,
    headers: {
      ...options.headers,
      ...headers,
    },
  };
};

export const customFetch = async (url, options = {}) => {
  return fetch(url, addHeaders(options));
};
export const getAPICall = async (url, skipMessage = false, headers = {}) => {
  const token = getAuthToken();
  //   if (!token) return;
  const res = await fetch(url, {
    headers: {
      ...headers,
      Authorization: token,
    },
  });
  if (res.ok) {
    return await res.json();
  } else {
    const error = await res.json();
    if (!skipMessage)
      alert(
        error.message || "Something went wrong. Please try again after sometime"
      );
    return {};
  }
};

export const writeAPICall = async (
  url,
  payload,
  method = "POST",
  skipMessage = false
) => {
  const token = getAuthToken();

  const res = await fetch(url, {
    method,
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
  if (res.ok) {
    if (!skipMessage) alert("Saved successfully");
    return await res.json();
  } else {
    const error = await res.json();
    alert(
      error.message || "Something went wrong. Please try again after sometime"
    );
    return false;
  }
};
