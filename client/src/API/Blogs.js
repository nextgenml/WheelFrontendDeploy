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

export const fetchPostedBlogsAPI = async (walletId, pageNo, pageSize) => {
  const res = await fetch(
    `${config.API_ENDPOINT}/api/v1/blogs/posted/?walletId=${walletId}&pageNo=${pageNo}&pageSize=${pageSize}`
  );
  if (res.ok) {
    return await res.json();
  } else {
    const error = await res.json();
    alert(
      error.message || "Something went wrong. Please try again after sometime"
    );
    return {};
  }
};

export const updatePostedBlogAPI = async (walletId, payload) => {
  const res = await fetch(
    `${config.API_ENDPOINT}/api/v1/blogs/posted?walletId=${walletId}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (res.ok) {
    alert("Saved successfully");
    return true;
  } else {
    const error = await res.json();
    alert(
      error.message || "Something went wrong. Please try again after sometime"
    );
    return false;
  }
};
