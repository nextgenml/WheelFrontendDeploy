export const getChoreCache = (id) => {
  return JSON.parse(localStorage.getItem(`chore_${id}`) || "{}");
};

export const setChoreCache = (id, key, value) => {
  const chore = JSON.parse(localStorage.getItem(`chore_${id}`) || "{}");

  chore[key] = value;
  localStorage.setItem(`chore_${id}`, JSON.stringify(chore));
};
