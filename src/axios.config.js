import axios from 'axios';

const client = axios.create({
  BASE_URL: process.env.REACT_APP_BASE_URL,
});

export default client;