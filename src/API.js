import Notiflix from 'notiflix';
import axios from 'axios';

const KEY_API = '34470534-ede093f1b3dde51cd75181a95';
const BASE_URL = 'https://pixabay.com/api/';
const PARAMETERS = 'image_type=photo&orientation=horizontal&safesearch=true';
export const PER_PAGE = 40;

export async function fetchImages(userQuery, page) {
  try {
    const { data } = await axios.get(
      `${BASE_URL}?key=${KEY_API}&q=${userQuery}&${PARAMETERS}&page=${page}&per_page=${PER_PAGE}`
    );
    return data;
  } catch (error) {
    console.log(error.name);
  }

  //.then(({ data }) => data);
}

// export function fetchImages(userQuery, page) {
//   return fetch(
//     `${BASE_URL}?key=${KEY_API}&q=${userQuery}&${PARAMETERS}&page=${page}&per_page=${PER_PAGE}`
//   )
//     .then(response => response.json())
//     .catch(error => console.log(error));
// }

// return axios
//   .get(
//     `${BASE_URL}?key=${KEY_API}&q=${userQuery}&${PARAMETERS}&page=${page}&per_page=${PER_PAGE}`
//   )
//   .then(({ data }) => data);
