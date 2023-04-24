export const getAPICall = async (url, skipMessage = false, headers = {}) => {
  const token = localStorage.getItem("auth_jwt_token");
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
