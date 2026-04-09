import axios from "axios";

const { create } = axios;

const axiosInst = create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
});
const loginRoute = "login/";

export const loginWithPhonenumberAndPassword = async (usernameOrPhone, password) => {

  const formData = new FormData();
  formData.append("phone_number", usernameOrPhone);
  formData.append("password", password);
  try {
    const response = await axiosInst.post(loginRoute, formData);
    return response;
    // ...
  } catch (error) {
    // Handle the error
    return error;
  }
};
