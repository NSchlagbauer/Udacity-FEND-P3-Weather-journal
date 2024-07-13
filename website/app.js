/* Global Variables */
// Personal API Key for OpenWeatherMap API
const apiKey = '0668935d32c192863d56906125f43bb4';
const baseWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather';
const baseGeoUrl = 'http://api.openweathermap.org/geo/1.0/zip';

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = `${d.getDate()}.${d.getMonth()+1}.${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;

// Event listener to add function to existing HTML DOM element
const generateButton = document.getElementById('generate');
generateButton.addEventListener('click', generateEntry);

/* Function called by event listener */
function generateEntry(e) {
  let zipCode = document.getElementById('zip').value;
  let countryCode = document.getElementById('country-code').value;
  let feelings = document.getElementById('feelings').value;

  // Get Geocoordinates for the provided ZIP and country codes
  getGeolocationData(baseGeoUrl, zipCode, countryCode, apiKey)
    .then(function(data) {
      // Get weather data for the found geocoordinates
      getWeatherData(baseWeatherUrl, data.lat, data.lon, apiKey)
        .then(function(data) { 
          // Add data to POST request and POST to journal 
          postJournalEntry('/addData', {temperature: data.main.temp, date: newDate, feelings: feelings});
          // Get project data back and refresh UI
        })
        .then(function() {
          refreshUI();
        });
    });
}

/* Function to GET Web API Data*/
// get geolocation from ZIP-code and country code
const getGeolocationData = async (baseUrl, zipCode, countryCode, apiKey) => {
  const res = await fetch(`${baseUrl}?zip=${zipCode},${countryCode}&appid=${apiKey}`);
  return await res.json();
}

const getWeatherData = async (baseUrl, latitude, longitude, apiKey) => {
  const res = await fetch(`${baseUrl}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
  return await res.json();
}

/* Function to POST data */
const postJournalEntry = async(path, data) => {
  const res = await fetch(path, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      temperature: data.temperature,
      date: data.date,
      feelings: data.feelings
    })
  });
}

/* Function to GET Project Data */
const refreshUI = async() => {
  const req = await fetch('/all');
  const allData = await req.json();

  document.getElementById('date').innerHTML = allData.date;
  document.getElementById('temp').innerHTML = allData.temperature + '°C';
  document.getElementById('content').innerHTML = allData.feelings;
}