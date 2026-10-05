import axios from "axios"

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

api.interceptors.request.use(config => {
    const jwtoken = localStorage.getItem("AUTH_TOKEN")
    if (jwtoken) {
        config.headers.Authorization = `Bearer ${jwtoken}`
    }
    return config
})