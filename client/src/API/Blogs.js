import config from "../config.js";
import { customFetch } from "./index.js";

export const getHomePageStats = async () => {
  const res = await customFetch(
    `${config.API_ENDPOINT}/api/v1/blogs/home-page-stats`
  );
  if (res.ok) {
    return await res.json();
  } else {
    alert("Something went wrong. Please try again after sometime");
  }
};

export const fetchPostedBlogsAPI = async (walletId, pageNo, pageSize, date) => {
  const res = await customFetch(
    `${config.API_ENDPOINT}/api/v1/blogs/posted/?walletId=${walletId}&pageNo=${pageNo}&pageSize=${pageSize}&date=${date}`
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
  const res = await customFetch(
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
