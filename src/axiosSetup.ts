import axios from "axios";

axios.defaults.baseURL = "https://your-api-base-url.com";
axios.defaults.headers.post["Content-Type"] = "application/json";