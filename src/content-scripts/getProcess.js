import axios from "axios";

export function getProcess(processNum, systemUrl, token) {
  return new Promise((resolve, reject) => {
    const apiURL = "http://127.0.0.1:8000/";
    const options = {
      method: "POST",
      url: apiURL + "api/consult-unique-process/",
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
