import axios from "axios";

export default axios.create({
  baseURL: "https://gopapi.grihasoft.com/api/",
  //baseURL: "http://localhost:51786/api/",
  //baseURL: "http://3.15.162.0/GOPWebAPI/api/",
  //baseURL: "http://14.98.21.186:4251/api/",
  //baseURL: "http://192.168.0.200:4251/api/",
  headers: {
    "Content-type": "application/json",
  },
});

export const baseURL = "https://gopapi.grihasoft.com/api/";
//export const baseURL = "http://localhost:51786/api/";

//git update-index --assume-unchanged path-to/ignored-file.ext
//git update-index --no-assume-unchanged path-to/ignored-file.ext