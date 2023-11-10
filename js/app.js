import {
  createApp,
  ref,
  computed,
  onMounted,
} from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

const url = "https://restcountries.com/v3.1/all";

async function getAllCountries(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Error fetching countries");
  }
  return response.json();
}

createApp({
  setup() {
    const countries = ref([]);
    const selectedRegion = ref("-1");
    const inputCountry = ref("");

    const regions = computed(() => {
      const regionsMap = countries.value.map((country) => country.region);
      const regionSet = new Set(regionsMap);
      return Array.from(regionSet);
    });

    const filteredCountries = computed(() => {
      return countries.value.filter(
        (country) =>
          (country.name.common
            .toLowerCase()
            .includes(inputCountry.value.toLowerCase()) &&
            country.region
              .toLowerCase()
              .includes(selectedRegion.value.toLowerCase())) ||
          (country.name.common
            .toLowerCase()
            .includes(inputCountry.value.toLowerCase()) &&
            selectedRegion.value == "-1")
      );
    });

    onMounted(async () => {
      countries.value = await getAllCountries(url);
    });

    return {
      countries,
      selectedRegion,
      inputCountry,
      regions,
      filteredCountries,
    };
  },
}).mount("#app");
