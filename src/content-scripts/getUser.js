// getUser.js
import axios from "axios";

export function getUser(token) {
  return new Promise((resolve, reject) => {
    const apiURL = "http://127.0.0.1:8000/";
    const options = {
      method: "GET",
      url: apiURL + "api/user",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .request(options)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
