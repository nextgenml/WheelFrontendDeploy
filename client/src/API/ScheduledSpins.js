import config from "../config.js";
import { customFetch } from "./index.js";

export const fetchSpinsAPI = async (pageNo, pageSize) => {
  const res = await customFetch(
    `${config.API_ENDPOINT}/api/v1/scheduledSpins?pageNo=${pageNo}&pageSize=${pageSize}`
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
