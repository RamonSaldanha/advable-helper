import axios from "axios";
import { API_URL, CONSULT_UNIQUE_PROCESS } from "../apiConfig";


export function getProcess(processNum, systemUrl, token) {
  return new Promise((resolve, reject) => {
    const options = {
      method: "POST",
      url: API_URL + CONSULT_UNIQUE_PROCESS,
      data: {
        processNum: processNum,
        systemUrl: systemUrl,
      },
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
