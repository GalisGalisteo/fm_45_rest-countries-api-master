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
    
    onMounted(async () => {
      countries.value = await getAllCountries(url);
    });

    return {
      countries,
    };
  },
}).mount("#app");
