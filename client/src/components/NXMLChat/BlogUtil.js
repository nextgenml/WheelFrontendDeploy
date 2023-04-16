export const getCachedPrompts = (initiative) => {
  try {
    const cachedData = localStorage.getItem(`${initiative}_generated_data`);

    if (cachedData) {
      const cachedPrompts = JSON.parse(cachedData);
      const prompts = Object.values(cachedPrompts).map((x) => x.prompt);
      if (prompts.length) return prompts;
    }
  } catch (error) {
    console.log("error in getCachedPrompts", error);
  }
};

export const updateInCache = (initiative, key, data, index) => {
  try {
    const cachedData = localStorage.getItem(`${initiative}_generated_data`);

    if (cachedData) {
      const cachedPrompts = JSON.parse(cachedData);
      if (cachedPrompts) {
        const prompt = cachedPrompts[index];
        prompt[key] = data;
        localStorage.setItem(
          `${initiative}_generated_data`,
          JSON.stringify(cachedPrompts)
        );
      }
    }
  } catch (error) {
    console.log("error in updateInCache", error);
  }
};

export const getCachedPrompt = (initiative, index, isBlogPage) => {
  try {
    if (!isBlogPage) return {};
    const cachedData = localStorage.getItem(`${initiative}_generated_data`);

    if (cachedData) {
      const cachedPrompts = JSON.parse(cachedData);
      return cachedPrompts[index];
    }
  } catch (error) {
    console.log("error in getCachedPrompt", error);
  }
  return {}
};
