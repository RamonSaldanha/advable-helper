import axios from "axios";
import { API_URL, CREATE_PROCESS_TRT } from "../apiConfig";

export function addProcessTRT(data, token) {
  return new Promise((resolve, reject) => {
    const options = {
      method: "POST",
      url: API_URL + CREATE_PROCESS_TRT,
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
