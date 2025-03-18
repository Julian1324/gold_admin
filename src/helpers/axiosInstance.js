import axios from "axios";
import { constants } from "../context/constants";

const axiosInstance = axios.create({
    baseURL: constants.API_URL
});

axiosInstance.interceptors.request.use(
    async (req) => {
        // const response = await axios.get('https://api.ipify.org/?format=json');
        // req.headers.ip = response.data.ip;
        return req;
    },
    (err) => err
);

// axiosInstance.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response.status === 401) {
//             // localStorage.clear();
//             // alert('La sesión caducó, inicia sesión otra vez');
//             // window.location.reload();
//             console.log('JWT EXPIRED');
//         }
//         return error;
//     }
// );

export default axiosInstance;