import axios from "axios";
import env from "../constants/env";

class Api {
  normalizePath(endpoint) {
    let res = endpoint.match(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
    );
    if (res !== null) {
      return endpoint;
    } else {
      return `${env.baseUri}/${endpoint}`;
    }
  }

  defaultHeader(object) {
    Object.keys(object).forEach((key) => {
      axios.defaults.headers.common[key] = object[key];
    });
  }

  GET(endpoint, params, headers = {}) {
    return new Promise((resolve) => {
      axios({
        method: "GET",
        url: this.normalizePath(endpoint),
        params,
        headers: { "Content-Type": "application/json", ...headers },
        validateStatus: (status) => {
          return true;
        },
      })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          console.log("GET error", error);
          resolve({ error: true, message: "Oops!  Something is wrong" });
        });
    });
  }

  POST(endpoint, params, headers = {}) {
    return new Promise((resolve) => {
      axios({
        method: "post",
        url: this.normalizePath(endpoint),
        data: JSON.stringify(params),
        headers: { "Content-Type": "application/json", ...headers },
        validateStatus: (status) => {
          return true;
        },
      })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          console.log("POST error", error);
          resolve({ error: true, message: "Oops!  Something is wrong" });
        });
    });
  }

  POSTFORMDATA(endpoint, params, headers = {}) {
    return new Promise((resolve) => {
      const data = new FormData();
      if (params) {
        Object.keys(params).forEach((key) => {
          data.append(key, params[key]);
        });
      }
      axios({
        method: "post",
        url: this.normalizePath(endpoint),
        data: data,
        headers: { "Content-Type": "multipart/form-data", ...headers },
        validateStatus: (status) => {
          return true;
        },
      })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          console.log("POSTFORMDATA error", error);
          resolve({ error: true, message: "Oops!  Something is wrong" });
        });
    });
  }

  PUT(endpoint, params, headers = {}) {
    return new Promise((resolve) => {
      axios({
        method: "put",
        url: this.normalizePath(endpoint),
        data: JSON.stringify(params),
        headers: { "Content-Type": "application/json", ...headers },
        validateStatus: (status) => {
          return true;
        },
      })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          console.log("POST error", error);
          resolve({ error: true, message: "Oops!  Something is wrong" });
        });
    });
  }

  DELETE(endpoint, params, headers = {}) {
    return new Promise((resolve) => {
      axios({
        method: "delete",
        url: this.normalizePath(endpoint),
        params,
        headers: { "Content-Type": "application/json", ...headers },
        validateStatus: (status) => {
          return true;
        },
      })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          console.log("GET error", error);
          resolve({ error: true, message: "Oops!  Something is wrong" });
        });
    });
  }


}

export default new Api();
