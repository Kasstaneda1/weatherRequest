
  const searchForm = document.querySelector("#search-form");
  const cityInput = document.querySelector("#city-input");
  const searchButton = document.querySelector("#search-btn");
  const loading = document.querySelector("#loading");
  const result = document.querySelector("#result");
  const emptyCityModal = document.querySelector("#empty-city-modal");

  // после закрытия окна возвращаем курсор в поле, чтобы можно было сразу печатать
  emptyCityModal.addEventListener("close", () => cityInput.focus());

  function setLoading(isLoading) {
    searchButton.disabled = isLoading;
    loading.hidden = !isLoading;
  }

  // MIKE  should use weatherSearchUI.setLoading(false) after API responses
  window.weatherSearchUI = { setLoading };

// === result (Михаил) ===
const resultBox = document.querySelector("#result");
const weatherCard = document.querySelector("#weather-card");
const errorCard = document.querySelector("#error-card");
const tempEl = document.querySelector("#weather-temp");
const cityEl = document.querySelector("#weather-city");
const iconEl = document.querySelector("#weather-icon");
const feelsEl = document.querySelector("#weather-feels");
const humidityEl = document.querySelector("#weather-humidity");
const windEl = document.querySelector("#weather-wind");
const tempMin = document.querySelector("#temp-min");
const tempMax = document.querySelector("#temp-max");
const visEl = document.querySelector("#visibility");
const pressureEl  = document.querySelector("#pressure");
const errorMessageEl = document.querySelector("#error-message");

searchForm.addEventListener('submit', async (event) => {
   event.preventDefault();
    const city = cityInput.value.trim();

    if (!city) {
      // По пункту 6 задания здесь должен быть alert:
      //   alert("Введите название города.");
      // Заменили на модальное окно, чтобы не выбиваться из оформления страницы.
      // Поведение то же: запрос не уходит, пока поле пустое.
      emptyCityModal.showModal();
      return;
    }

    setLoading(true);
    result.hidden = true;
  // const city = event.detail.city;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APP_ID}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // fetch не считает 404 и 401 ошибкой, поэтому ругаемся сами
    if (!response.ok) {
      const error = new Error(data.message);
      error.code = data.cod;
      throw error;
    }

    showWeather(data);
  } catch (error) {
    showError(error.code, error.message);
  } finally {
    // выполняется всегда, иначе кнопка останется заблокированной навсегда
    weatherSearchUI.setLoading(false);
  }
});

function showWeather(data) {
  tempEl.textContent = `${Math.round(data.main.temp - 273.15)}°`;
  cityEl.textContent = data.name;
  feelsEl.textContent = `${Math.round(data.main.feels_like - 273.15)}°`;
  humidityEl.textContent = `${data.main.humidity}%`;
  windEl.textContent = `${data.wind.speed.toFixed(1)} m/s`;
  tempMin.textContent = `${Math.round(data.main.temp_min - 273.15)}°`;
  tempMax.textContent = `${Math.round(data.main.temp_max - 273.15)}°`;
  visEl.textContent = `${(data.visibility / 1000).toFixed(1)} km`;
 pressureEl.textContent = `${(data.main.pressure * 0.75).toFixed(1)}`;

  // img/wn/...@2x отдаёт 100x100 вместо 50x50, иначе иконка мылится
  iconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  iconEl.alt = data.weather[0].description;

  errorCard.hidden = true;
  weatherCard.hidden = false;
  resultBox.hidden = false;
}

function showError(code, message) {
  errorMessageEl.textContent = `${code ?? "сеть"}: ${message}`;

  weatherCard.hidden = true;
  errorCard.hidden = false;
  resultBox.hidden = false;
}
