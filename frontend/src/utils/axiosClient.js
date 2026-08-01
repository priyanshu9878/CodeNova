import axios from 'axios'

export const axiosClient = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials:true,   // browser attach token
    headers:{
        'Content-Type': 'application/json'
    }
});