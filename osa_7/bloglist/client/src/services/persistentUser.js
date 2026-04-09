const USER_KEY = "loggedBlogappUser";

const getUser = () => {
  const userJSON = window.localStorage.getItem(USER_KEY);
  if (!userJSON) return null;
  return JSON.parse(userJSON);
};

const saveUser = (user) => {
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
};

const removeUser = () => {
  window.localStorage.removeItem(USER_KEY);
};

export default { getUser, saveUser, removeUser };