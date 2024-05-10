// getUser.js
import axios from "axios";
import { API_URL, GET_USER } from "../apiConfig";

export function getUser(token) {
  return new Promise((resolve, reject) => {
    const options = {
      method: "GET",
      url: API_URL + GET_USER,
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
