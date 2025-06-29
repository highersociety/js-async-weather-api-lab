const apiKey = 'edb4e5d285c614b00d6a376afedd7a7d';  

document.getElementById('weatherForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const city = document.getElementById('cityInput').value.trim().replace(/ /g, '+');

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`)
    .then(response => response.json())
    .then(data => {
      document.getElementById('temp').textContent = data.main.temp + ' °F';
      document.getElementById('humidity').textContent = data.main.humidity + ' %';
      document.getElementById('conditions').textContent = data.weather[0].description;
    })
    .catch(err => console.error('Error fetching current weather:', err));

  getForecast(city);
});

function getForecast(city) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`)
    .then(response => response.json())
    .then(data => {
      const forecastDiv = document.getElementById('forecast');
      forecastDiv.innerHTML = '';

      const labels = [];
      const temps = [];

      data.list.forEach(item => {
        const forecastItem = document.createElement('div');
        forecastItem.innerHTML = `<strong>${item.dt_txt}</strong><br>
          Temp: ${item.main.temp} °F<br>
          Humidity: ${item.main.humidity} %<br>`;
        forecastDiv.appendChild(forecastItem);

        labels.push(item.dt_txt);
        temps.push(item.main.temp);
      });

      renderChart(labels, temps);
    })
    .catch(err => console.error('Error fetching forecast:', err));
}

function renderChart(labels, dataPoints) {
  const ctx = document.getElementById('forecastChart').getContext('2d');

  if (window.myChart instanceof Chart) {
    window.myChart.destroy();
  }

  window.myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Temperature (°F)',
        data: dataPoints,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.3
      }]
    },
    options: {
      scales: {
        x: { display: true },
        y: { display: true }
      }
    }
  });
}
