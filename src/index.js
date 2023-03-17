import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { fetchImages, PER_PAGE } from './API';

let page = 1;
let userQuery = '';

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
loadMoreBtn.style.display = 'none';

function renderGallery(hits) {
  const markup = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<a class="image-link" href = "${largeImageURL}"> <div class="photo-card">
  <img class="image-item" src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
  </div></a>`
    )
    .join('');
  galleryEl.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

async function onSubmit(e) {
  try {
    e.preventDefault();
    galleryEl.innerHTML = '';
    loadMoreBtn.style.display = 'none';
    page = 1;
    const { searchQuery } = e.currentTarget.elements;
    userQuery = searchQuery.value;
    if (userQuery === '' || userQuery === ' ') {
      Notiflix.Notify.failure('Please, enter valid search term.');
      return;
    }
    const response = await fetchImages(userQuery, page);

    if (response.hits.length === 0) {
      Notiflix.Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    renderGallery(response.hits);

    Notiflix.Notify.success(`Hooray! We found ${response.totalHits} images.`);
    if (response.totalHits > PER_PAGE) {
      loadMoreBtn.style.display = 'inline-block';
      page++;
    } else {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    console.log(error.name);
  }
}

async function onLoadMore() {
  try {
    const response = await fetchImages(userQuery, page);

    if (
      response.totalHits < response.hits.length * page ||
      response.hits.length < PER_PAGE
    ) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      loadMoreBtn.style.display = 'none';
    }
    renderGallery(response.hits);
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
    page++;
  } catch (error) {
    console.log(error.name);
  }
}

const lightbox = new SimpleLightbox('.gallery a', {
  overlayOpacity: 0.4,
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 350,
  animationSpeed: 500,
});

const onButtonIntersect = entities => {
  const [button] = entities;
  if (button.isIntersecting) {
    onLoadMore();
  }
};

const observer = new IntersectionObserver(onButtonIntersect);
observer.observe(loadMoreBtn);

formEl.addEventListener('submit', onSubmit);
loadMoreBtn.addEventListener('click', onLoadMore);
