import {
  _updateUI,
  _getDates,
  _fetchPixaby,
  _fetchDarkSky,
  _loadingState,
  _fetchGeoNames,
} from './components';
var slimCardElm = document.getElementById('slim-card');

_loadingState('none');

if(slimCardElm) {
  slimCardElm.style.display = 'none';
}

export const performAction = async (e) => {
  e.preventDefault();
  
  _loadingState('block');
  // check what text was put into the form field
  let today = new Date().getTime();
  let zipCode = document.getElementById('zip').value;
  let depart = new Date(document.getElementById("departing").value).getTime();
  let retur = new Date(document.getElementById("returning").value).getTime();
  let allDates = {
    dates: {
      depart,
      retur,
      today
    }
  };
  const leftDays = _getDates(allDates.dates);
  let myData = {
    dates: leftDays
  }

  await _fetchGeoNames(zipCode).then(response => {
    _fetchDarkSky(response.lat, response.lng).then(res => {
      myData = {
        ...myData,
        weather: {
          weatherSum: res.summary,
          weatherTemp: res.temperatureLow
        }
      }

      _updateUI(myData)
    })

    _fetchPixaby(response.placeName).then(res => {
      myData = {
        ...myData,
        img: res,
        placeName: response.placeName,
      }

      _updateUI(myData)
    })
  });
}