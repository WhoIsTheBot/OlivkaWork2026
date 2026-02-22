import axios from "axios";

const api = axios.create({
    baseURL: "https://olivkawork2026.onrender.com",
    withCredentials: true,
    
});

export default api;
