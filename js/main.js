const url = "https://restcountries.com/v3.1/all";

let countries;

const inputSearch = document.querySelector("#input-field-country");
const regionSelect = document.querySelector("#region-select");

const countriesContainer = document.querySelector("#countries-selection-box");
const btnToggleDarkMode = document.querySelector("#btn-toggle-dark-mode");

function toggleDarkMode() {
  document.querySelector("html").classList.toggle("dark-mode");
  btnToggleDarkMode.children[0].classList.toggle("bi-moon");
  btnToggleDarkMode.children[0].classList.toggle("bi-moon-fill");
}

async function getAllCountries(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Error fetching countries");
  }
  countries = await response.json();
}

function createCountriesBox(countries) {
  countries.forEach((country) => {
    const img = country.flags.png;
    const commonName = country.name.common;
    const population = parseInt(country.population).toLocaleString("es");
    const region = country.region;
    let capital;
    if (!country.capital) {
      capital = "None";
    } else {
      capital = country.capital.join(", ");
    }

    const countryDiv = document.createElement("div");
    countryDiv.classList.add("country-info-box");
    countryDiv.innerHTML = `
    <img src=${img}>
    <h3>${commonName}</h3>
    <p>Population: ${population}</p>
    <p>Region: ${region}</p>
    <p>Capital:  ${capital}</p>
    `;

    countriesContainer.appendChild(countryDiv);
  });
}

function filtreCountries(countries) {
  return countries.filter((country) => {
    return (
      country.name.official
        .toLowerCase()
        .includes(inputSearch.value.toLowerCase()) &&
      (country.region === regionSelect.value || regionSelect.value === "-1")
    );
  });
}

function searchCountries(countries) {
  inputSearch.addEventListener("input", () => {
    countriesContainer.innerHTML = "";

    if (inputSearch.value === "") {
      createCountriesBox(countries);
    }
    const filteredCountries = filtreCountries(countries);
    createCountriesBox(filteredCountries);
  });
}

function filtreRegion(countries) {
  const regionsMap = countries.map((country) => {
    return country.region;
  });
  const regions = [...new Set(regionsMap)];

  regionSelect.innerHTML = `<option value="-1">Filter by region</option>`;
  regions.forEach((region) => {
    const regionOption = document.createElement("option");
    regionOption.value = region;
    regionOption.textContent = region;
    regionSelect.appendChild(regionOption);
  });

  regionSelect.addEventListener("change", () => {
    countriesContainer.innerHTML = "";

    if (regionSelect.value === "-1") {
      createCountriesBox(countries);
    }

    const filteredCountries = filtreCountries(countries);
    createCountriesBox(filteredCountries);
  });
}

function countryDetails() {
  countriesContainer.addEventListener("click", (event) => {
    if (event.target.tagName === "IMG") {
      countriesContainer.classList.add("display-none");
      document
        .querySelector("#country-details")
        .classList.remove("display-none");
      const countryFinded = countries.find(
        (c) => c.flags.png === event.target.src
      );
      console.log(
        "🚀 ~ file: main.js:109 ~ countriesContainer.addEventListener ~ countryFinded:",
        countryFinded
      );
      const flag = countryFinded.flags.png;
      const commonName = countryFinded.name.common;
      const population = parseInt(countryFinded.population).toLocaleString(
        "es"
      );
      const region = countryFinded.region;
      const subRegion = countryFinded.subregion;
      let capital;
      if (!countryFinded.capital) {
        capital = "None";
      } else {
        capital = countryFinded.capital.join(", ");
      }
      let topLevelDomain;
      if (!countryFinded.tld) {
        topLevelDomain = "";
      } else {
        topLevelDomain = countryFinded.tld.join(", ");
      }
      const currencies = Object.entries(countryFinded.currencies)
        .map(
          ([currencyCode, currencyObject]) =>
            `${currencyObject.name} (${currencyObject.symbol})`
        )
        .join(", ");
      const languages = Object.entries(countryFinded.languages)
        .map(
          ([languageCode, languageName]) => `${languageName} (${languageCode})`
        )
        .join(", ");

      document.querySelector("#country-detail-flag").src = flag;
      document.querySelector("#detail-native-name").textContent = commonName;
      document.querySelector("#detail-population").textContent = population;
      document.querySelector("#detail-region").textContent = region;
      document.querySelector("#detail-sub-region").textContent = subRegion;
      document.querySelector("#detail-capital").textContent = capital;
      document.querySelector("#detail-tld").textContent = topLevelDomain;
      document.querySelector("#detail-currency").textContent = currencies;
      document.querySelector("#detail-languages").textContent = languages;

      const borderCountriesContainer = document.querySelector(
        "#border-countries-container"
      );
      borderCountriesContainer.innerHTML = "";
      countryFinded.borders.forEach((b) => {
        if (b) {
          const borderCountry = document.createElement("button");
          borderCountry.classList.add("border-country");
          borderCountry.textContent = b;
          borderCountriesContainer.appendChild(borderCountry);
        }
      });
    }
  });
}

function backBtn() {
  document.querySelector("#btn-leave-details").addEventListener("click", () => {
    document.querySelector("#country-details").classList.add("display-none");
    document
      .querySelector("#countries-selection-box")
      .classList.remove("display-none");
  });
}

function borderCountriesBtn() {
  document
    .querySelector("#border-countries-container")
    .addEventListener("click", (event) => {
      console.log(event.target.textContent);
    });
}

async function init() {
  btnToggleDarkMode.addEventListener("click", toggleDarkMode);
  await getAllCountries(url);
  createCountriesBox(countries);
  searchCountries(countries);
  filtreRegion(countries);
  countryDetails();
  backBtn();
  borderCountriesBtn();
}

window.onload = init();
