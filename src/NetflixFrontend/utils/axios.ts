import axios, { AxiosInstance } from 'axios';

const movieCatalogBaseURL = process.env.MOVIE_CATALOG_SERVICE;

export default function getInstance(): AxiosInstance {
  return axios.create({
    baseURL: movieCatalogBaseURL,
  });
}
