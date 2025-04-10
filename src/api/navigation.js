// navigation.js
let navigate;

export const setNavigate = (navFn) => {
  navigate = navFn;
};

export const redirectToLogin = () => {
  if (navigate) {
    navigate("/login");
  }
};
