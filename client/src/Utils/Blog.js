import { customFetch } from "../API/index.js";
import config from "../config.js";

export const updateBlogCount = async (walletId) => {
  return await customFetch(`${config.API_ENDPOINT}/update-blog-count`, {
    method: "POST",
    body: JSON.stringify({
      walletId,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};
