import './css/styles.css';
import fetchCountries from './fetchCountries.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;
const MAX_COUNTRIES_TO_VIEW = 10;

const inputSeach = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputSeach.addEventListener('input', debounce(renderMarkup, DEBOUNCE_DELAY));

function renderMarkup(evt) {
  const userRequest = evt.target.value.trim();
  cleanMarkup();

  if (!userRequest) {
    return;
  }
  fetchCountries(userRequest)
    .then(onSearchQuery)
    .catch(error => Notify.failure('Oops, there is no country with that name'));
}

function onSearchQuery(data) {
  if (data.length > MAX_COUNTRIES_TO_VIEW) {
    return Notify.info('Too many matches found. Please enter a more specific name.');
  }
  if (data.length === 1) {
    return renderOneCountry(data);
  }
  renderCountriesList(data);
}

function renderCountriesList(data) {
  const countriesMarkup = data
    .map(
      ({ flags, name }) => `<li class="country-list__item">
          <img src="${flags.svg}" alt="${name.official} flag" width="40"/>
          <p>${name.official}</p>
        </li>`,
    )
    .join('');
  countryList.innerHTML = countriesMarkup;
  countryList.style.listStyle = 'none';
}

function renderOneCountry(data) {
  const oneCountryMarkup = data
    .map(({ flags, name, capital, population, languages }) => {
      return `<div class="country-info__item">
        <img src="${flags.svg}" alt="${name.official} flag" width="40" />
        <h1>${name.official}</h1>
      </div>
      <ul style="list-style:none">
        <li><b>Capital: </b>${capital}</li>
        <li><b>Population: </b>${population}</li>
        <li><b>Languages: </b>${Object.values(languages)}</li>
      </ul>
  `;
    })
    .join('');
  countryInfo.innerHTML = oneCountryMarkup;
}

function cleanMarkup() {
  countryInfo.innerHTML = '';
  countryList.innerHTML = '';
}
