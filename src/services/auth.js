export const isBrowser = () => typeof window !== "undefined";
export const getUser = () =>
  isBrowser() && window.localStorage.getItem("gatsbyUser")
    ? JSON.parse(window.localStorage.getItem("gatsbyUser"))
    : {};
const setUser = user =>
  window.localStorage.setItem("gatsbyUser", JSON.stringify(user));
export const handleLogin = ({ password }) => {
  console.log(`CHECKING${password}:`, password);
  if (password == "phil") {
    setUser({
      username: `phil`,
      name: `Phil`
    });
    return true;
  }
  return false;
};
export const isLoggedIn = () => {
  const user = getUser();
  return !!user.username;
};
export const logout = callback => {
  setUser({});
  callback();
};
