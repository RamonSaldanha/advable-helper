import axios from "axios";
import { API_URL, CREATE_PROCESS } from "../apiConfig";

export function addProcess(data, token) {
  return new Promise((resolve, reject) => {
    const options = {
      method: "POST",
      url: API_URL + CREATE_PROCESS,
      data: data,
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
