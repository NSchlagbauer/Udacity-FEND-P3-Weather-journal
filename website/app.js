/* Global Variables */
// Personal API Key for OpenWeatherMap API
const apiKey = '0668935d32c192863d56906125f43bb4';
const baseWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather';

// Create a new date instance dynamically with JS
let d = new Date();
let formattedMinutes = d.getMinutes();
if (formattedMinutes < 10) {
  formattedMinutes = '0' + formattedMinutes;
}
let newDate = `${d.getDate()}.${d.getMonth()+1}.${d.getFullYear()} ${d.getHours()}:${formattedMinutes}`;

// Event listener to add function to existing HTML DOM element
const generateButton = document.getElementById('generate');
generateButton.addEventListener('click', generateEntry);

/* Function called by event listener */
function generateEntry(e) {
  let zipCode = document.getElementById('zip').value;
  let feelings = document.getElementById('feelings').value;
  getWeatherData(baseWeatherUrl, zipCode, apiKey)
    .then(function(data) { 
      // Add data to POST request and POST to journal 
      postJournalEntry('/addData', {temperature: data.main.temp, date: newDate, feelings: feelings});
      // Get project data back and refresh UI
    })
    .then(function() {
      refreshUI();
    });
}

/* Function to GET Web API Data*/
const getWeatherData = async (baseUrl, zipCode, apiKey) => {
  const res = await fetch(`${baseUrl}?q=${zipCode}&appid=${apiKey}&units=metric`);
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