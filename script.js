function getWeather() {
  const apiKey = 'b9a23c1a059b13e54e3e98fe2ea68fdc';
  const city = document.getElementById('city').value.trim();

  if (!city) {
    alert('Please enter a city name!');
    return;
  }

  const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

  // Fetch current weather
  fetch(currentWeatherURL)
    .then(response => response.json())
    .then(data => {
      displayWeather(data);
    })
    .catch(error => {
      console.error("Error fetching current weather:", error);
      alert("Could not fetch current weather. Try again.");
    });

  // Fetch hourly forecast
  fetch(forecastURL)
    .then(response => response.json())
    .then(data => {
      displayHourlyForecast(data.list);
    })
    .catch(error => {
      console.error("Error fetching forecast:", error);
      alert("Could not fetch forecast. Try again.");
    });
}

function displayWeather(data) {
  const tempDiv = document.getElementById("temprature");
  const infoDiv = document.getElementById("weather-info");
  const icon = document.getElementById("weather-icon");

  tempDiv.innerHTML = '';
  infoDiv.innerHTML = '';
  icon.style.display = "none";

  if (data.cod === "404") {
    infoDiv.innerHTML = `<p>${data.message}</p>`;
    return;
  }

  const tempCelsius = Math.round(data.main.temp - 273.15);
  const cityName = data.name;
  const description = data.weather[0].description;
  const iconCode = data.weather[0].icon;
  const iconURL = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

  tempDiv.innerHTML = `<p>${tempCelsius}°C</p>`;
  infoDiv.innerHTML = `<p>${cityName}</p><p>${description}</p>`;
  icon.src = iconURL;
  icon.alt = description;
  icon.style.display = "block";
}

function displayHourlyForecast(forecastData) {
  const hourlyDiv = document.getElementById("hourly-forecast");
  hourlyDiv.innerHTML = ''; // Clear previous data

  const next8 = forecastData.slice(0, 8); // next 24 hours (3h interval)

  next8.forEach(item => {
    const dateTime = new Date(item.dt * 1000);
    const hour = dateTime.getHours();
    const temp = Math.round(item.main.temp - 273.15);
    const iconCode = item.weather[0].icon;
    const iconURL = `https://openweathermap.org/img/wn/${iconCode}.png`;

    const hourlyItem = `
      <div class="hourly-item">
        <span>${hour}:00</span>
        <img src="${iconURL}" alt="weather icon" />
        <span>${temp}°C</span>
      </div>
    `;
    hourlyDiv.innerHTML += hourlyItem;
  });
}
