import axios from 'axios';

// import qs from 'qs';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default axios.create({
	baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
	baseURL: BASE_URL,
	headers: {},
	withCredentials: true
})