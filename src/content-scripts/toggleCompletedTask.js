import axios from "axios";
import { API_URL, TOGGLE_COMPLETED_TASK } from "../apiConfig";

export function toggleCompletedTask(data, token) {
  return new Promise((resolve, reject) => {
    const options = {
      method: "POST",
      url: API_URL + TOGGLE_COMPLETED_TASK,
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
