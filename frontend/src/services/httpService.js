import axios from 'axios';

const BASE_URL =
  /*process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001'
    : 'https://flash-cards-backend-rrgomide.glitch.me';*/

  process.env.NODE_ENV ===
  "https://raw.githubusercontent.com/geovannyAvelar/Dados-Abertos-Campeonato-Brasileiro/master";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export async function read(url) {
  const { data } = await axiosInstance.get(url);
  return data;
}