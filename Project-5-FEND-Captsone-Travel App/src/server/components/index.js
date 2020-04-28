const axios = require('axios');

const GeoNames = 'api.geonames.org/postalCodeSearchJSON?';
const darkSky = 'api.darksky.net/forecast';
const pixabayAPI = 'pixabay.com/api';

// function to aggrogate the geoNames route, api key and url with zip search
_fetchGeoNames = async (username, zipOrCity = '11230') => {
  // we build our data necessary for doing the fetch operation from weather api
  const cityOrPostal = getCityOrPostalCode(zipOrCity);
  const url = `http://${GeoNames}${cityOrPostal}&maxRows=10&username=${username}`;
  return axios.get(url).then(response => {
    return response.data.postalCodes[0];
  });
};

getCityOrPostalCode = zipOrCity => {
  if (/\d/.test(zipOrCity.value)) {
    return 'postalcode=' + zipOrCity;
  } else {
    // Otherwise we simply expect it to be a city, and as above, do validation here if you want to
    return 'placename=' + zipOrCity;
  }
};

// function to send lat/long to dark sky
_fetchDarkSky = async (darkSkyKey, lat, long) => {
  const url = `https://${darkSky}/${darkSkyKey}/${lat},${long}`;
  return axios.get(url).then(response => {
    return response.data.daily.data[0];
  });
};

_fetchPixaby =  async (pixabaykey, image) => {
  // data necessary for doing the fetch operation from pixabay api
  const url = `https://${pixabayAPI}/?key=${pixabaykey}&q=${image}`;
  return await axios.get(url).then(response => {
    if (response.data.totalHits != 0) {
      return response.data.hits[0].largeImageURL;
    } else {
      return { error: 'no results' };
    }
  });
};