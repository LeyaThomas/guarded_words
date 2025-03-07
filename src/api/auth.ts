import axios from 'axios';
import toast from 'react-hot-toast';

// Create a public gateway instance
export const publicGateway = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_GATEWAY_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for public gateway requests
publicGateway.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

// Create a private gateway instance
export const privateGateway = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_GATEWAY_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for private gateway requests
privateGateway.interceptors.request.use(
  function (config) {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    if (config.url) {
      if (!config.url.endsWith('/') && !config.url.includes('?')) {
        config.url += '/';
      }
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

// Interceptor for private gateway responses
privateGateway.interceptors.response.use(
    function (response) {
      return response;
    },
    async function (error) {
      if (error.response.status === 401) {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
          toast.error("No refresh token found. Please log in again.");
          localStorage.clear();
          window.location.href = "/login";
          return Promise.reject(error);
        }
  
        try {
          // Refresh the access token
          const response = await publicGateway.post("/users/token/refresh/", {
            refresh: refreshToken,
          });
  
          // Update the access and refresh tokens in local storage
          localStorage.setItem("access_token", response.data.access);
          localStorage.setItem("refresh_token", response.data.refresh);
  
          // Retry the original request with the new access token
          const { config } = error;
          config.headers["Authorization"] = `Bearer ${localStorage.getItem("access_token")}`;
          return await privateGateway(config);
        } catch (error_2) {
          toast.error("Your session has expired. Please login again.");
          setTimeout(() => {
            localStorage.clear();
            window.location.href = "/login";
          }, 2000);
          return Promise.reject(error_2);
        }
      } else {
        return Promise.reject(error);
      }
    }
  );

// Authentication functions
export const signup = async (email: string, username: string, password: string, role: string = "reader") => {
  return publicGateway.post(`/users/signup/`, { email, username, password, role });
};

export const login = async (email: string, password: string) => {
  return publicGateway.post(`/users/login/`, { email, password });
};