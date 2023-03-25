import config from "../config.js";

export const getHomePageStats = async () => {
  const res = await fetch(
    `${config.API_ENDPOINT}/api/v1/blogs/home-page-stats`
  );
  if (res.ok) {
    return await res.json();
  } else {
    alert("Something went wrong. Please try again after sometime");
  }
};
