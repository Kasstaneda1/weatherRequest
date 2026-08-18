(() => {
  const searchForm = document.querySelector("#search-form");
  const cityInput = document.querySelector("#city-input");
  const searchButton = document.querySelector("#search-btn");
  const loading = document.querySelector("#loading");
  const result = document.querySelector("#result");

  function setLoading(isLoading) {
    searchButton.disabled = isLoading;
    loading.hidden = !isLoading;
  }

  // Мihail  should use weatherSearchUI.setLoading(false) after API responses
  window.weatherSearchUI = { setLoading };

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (!city) {
      alert("Введите название города.");
      cityInput.focus();
      return;
    }

    setLoading(true);
    result.hidden = true;

    // Михаил слушает это событие, выполняет запрос и рисует результат.
    document.dispatchEvent(
      new CustomEvent("weather:search", {
        detail: { city },
      }),
    );
  });
})();
