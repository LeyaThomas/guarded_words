import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/users/";

export const signup = async (email: string, username: string, password: string, role: string = "reader") => {
    // Add the role as part of the request payload
    return axios.post(`${API_URL}signup/`, { email, username, password, role });
};

export const login = async (email: string, password: string) => {
    return axios.post(`${API_URL}login/`, { email, password });
};
