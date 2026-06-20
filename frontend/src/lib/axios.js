import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api",
});  // it removes the evertime writting url while fetching

// middleman that runs before every request
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); // when you login, backend sends a JWT token. token is saved in localStorage. // now when everytime we call backend, this token will verify who this user is
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;