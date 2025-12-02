import axios from "axios";

export const api = axios.create({
  baseURL: process.env.API_PYTHON_KEY,
  timeout: 10000,
})