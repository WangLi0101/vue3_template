import axios from "axios";
import { setupHttpInterceptors } from "./interceptors";

const http = axios.create({
  timeout: 10000,
});

setupHttpInterceptors(http);

export { http };
