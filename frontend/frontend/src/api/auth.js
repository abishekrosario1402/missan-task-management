import api from "./api";

export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  localStorage.setItem(
    "access_token",
    response.data.access_token
  );

  return response.data;
};

export const registerUser = async (email, password) => {
  const response = await api.post("/auth/register", {
    email,
    password,
  });

  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem("access_token");
};