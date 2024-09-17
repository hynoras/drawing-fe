import axios from "axios";

//Production
const url = 'https://backendpainter-v1.onrender.com';
//Testing
// const url = 'http://localhost:8081';


export const loginUser = (data) => {
  return async (dispatch) => {
    let response;
    try {
      response = await axios.post(`${url}/login`, data);
      const output = response.data;

      if (output.status === "success") {
        localStorage.setItem('email',`${data.email}`);
        localStorage.setItem('token-user',`${output.token}`);
        dispatch({
          type: "LOGIN_USER_SUCCESS",
          payload: output.token,
        });
      }
    } catch (error) {
      const output = error.response.data;
      dispatch({
        type: "LOGIN_USER_FAILED",
        payload: output.error,
      });
    }
    return response; // Return the entire response object
  };
};


export const registerUser = (data) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`${url}/register`, data);
      console.log(response);

      const output = response.data;
      if (output.status === "success") {
        dispatch({
          type: "REGISTER_USER_SUCCESS",
          payload: output.message,
        });
      }
    } catch (error) {
      const output = error.response.data;
      if (output.message) {
        dispatch({
          type: "REGISTER_USER_FAIL",
          payload: output.message,
        });
      } else {
        dispatch({
          // error of same username/email/phoneNumber,it has to be unique no duplication/same username.
          type: "REGISTER_USER_INVALID",
          payload: output.error,
        });
      }
    }
  };
};

export const userLogout = () => {
  return (dispatch) => {
    dispatch({
      type: "LOGOUT_USER",
    });
  };
};
