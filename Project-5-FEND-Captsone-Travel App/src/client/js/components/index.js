var currentPort = 8080;

export const _fetchGeoNames = async (zip = '11230') => {
    const url = `http://localhost:${currentPort}/geonames?zip=${zip}`;
    return await fetch(url).then(response => response.json());
};

export const _fetchDarkSky = async (lat, long) => {
    const url = `http://localhost:${currentPort}/darksky?lat=${lat}&long=${long}`;
    return await fetch(url).then(response => response.json());
};

export const _fetchPixaby = async image => {
    const url = `http://localhost:${currentPort}/pixabay?image=${image}`;
    return await fetch(url).then(response => response.json());
};

export const _getDates = (dates) => {
    _loadingState('block');
    try {
        let date = {};
        let msInDay = 24 * 3600 * 1000;
        let depart = dates.depart;
        let retur = dates.retur;
        let today = dates.today;

        date.timeLeft = Math.floor((depart - today) / msInDay);
        date.duration = Math.floor((retur - depart) / msInDay)

        if (date.timeLeft == -1) {
            date.timeLeft = "Your trip is today"
        } else {
            date.timeLeft++;
        }

        return date;
    } catch {
        console.log("Error - Dates");
    }
}


/* Update UI */
export const _updateUI = async (myData) => {
  if(myData.dates && myData.img && myData.weather) {
    _loadingState('none');
    document.getElementById('slim-card').style.display = 'inline-block';
    document.getElementById("city").src = await myData.img;
    document.getElementById('placeName').textContent = myData.placeName;
    document.getElementById("countDown").textContent = myData.dates.timeLeft;
    document.getElementById("duration").textContent = myData.dates.duration;
    document.getElementById("weather-sum").textContent = myData.weather.weatherSum;
    document.getElementById("weather-temp").textContent = `${myData.weather.weatherTemp}°C`;
  } else {
    _loadingState('block');
  }
};

export const _loadingState = (display) => {
    var loadingElm = document.getElementById("loading");
    if(loadingElm) {
        loadingElm.style.display = display;
    }
}