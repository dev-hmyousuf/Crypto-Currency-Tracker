/**
 * ================================================
 * Title: main.js
 * Author: H.M.Yousuf
 * Date: 2024-10-30
 * Project: Crypto Currency Price Tracker
 * Description: Brief description of the file's purpose and content
 * ================================================
 */

// Start coding below

let currencyRates = {};
let selectedCurrency = "usd";
const searchBar = document.getElementById("search-bar");

(async () => {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
    );

    if (!response.ok) throw new Error("Failed to fetch crypto data");

    const data = await response.json();
    displayCrypto(data, selectedCurrency);

    const searchForm = document.getElementById("search");
    const searchBar = document.getElementById("search-bar");

    searchBar.addEventListener("change", (e) => {
      e.preventDefault();
      const query = searchBar.value.toLowerCase();
      const filteredData = data.filter((crypto) =>
        crypto.name.toLowerCase().includes(query)
      );
      displayCrypto(filteredData, selectedCurrency);
    });

    fetchNationalCurrencies(data);
  } catch (error) {
    console.error("Error:", error);
  }
})();

const fetchNationalCurrencies = async (cryptoData) => {
  const API_KEY = "f9887d57f4484fe4a963ffd54a6a1437";
  try {
    const response = await fetch(
      `https://openexchangerates.org/api/latest.json?app_id=${API_KEY}&base=USD`
    );

    if (!response.ok) throw new Error("Failed to fetch currency data");

    const data = await response.json();
    currencyRates = data.rates;
    displayNationalCurrencies(data.rates);

    const nationalCurrencies = document.getElementById("nationalCurrencies");
    nationalCurrencies.value = selectedCurrency;

    nationalCurrencies.addEventListener("change", (event) => {
      event.preventDefault();
      selectedCurrency = event.target.value;
      updateCryptoPrices(selectedCurrency, cryptoData);
      displayCrypto(cryptoData, selectedCurrency);
    });
  } catch (error) {
    console.error("Error:", error);
  }
};

const displayNationalCurrencies = (currencies) => {
  const nationalCurrencies = document.getElementById("nationalCurrencies");
  nationalCurrencies.innerHTML = "";

  for (const [code, price] of Object.entries(currencies)) {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = `${code} - ${price.toFixed(2)}`;
    nationalCurrencies.appendChild(option);
  }

  nationalCurrencies.value = selectedCurrency;
};

const displayCrypto = (data, currency) => {
  const cryptoList = document.getElementById("crypto-list");
  cryptoList.innerHTML = "";

  data.forEach((crypto) => {
    const cryptoItem = document.createElement("li");

    cryptoItem.classList.add(
      "p-4",
      "w-full",
      "bg-gray-700",
      "rounded-lg",
      "flex",
      "justify-between",
      "items-center",
      "shadow-md",
      "transition",
      "duration-300",
      "hover:bg-gray-600",
      "hover:shadow-lg"
    );

    const priceInUSD = crypto.current_price;
    const currencyRate = currencyRates[currency];
    const priceInSelectedCurrency = currencyRate
      ? (priceInUSD * currencyRate).toFixed(2)
      : priceInUSD.toFixed(2);

    cryptoItem.innerHTML = `
            <div class="flex items-center space-x-3">
                <img src="${crypto.image}" alt="${
      crypto.name
    }" class="w-10 h-10">
                <span class="text-white font-semibold">${
                  crypto.name
                } (${crypto.symbol.toUpperCase()})</span>
            </div>
            <span class="text-green-500 font-semibold" id="price-${
              crypto.id
            }">${
      currencyRate ? currency.toUpperCase() : "USD"
    } ${priceInSelectedCurrency}</span>`;

    cryptoList.appendChild(cryptoItem);
  });
};

const updateCryptoPrices = (currencyCode, cryptoData) => {
  cryptoData.forEach((crypto) => {
    const priceInUSD = crypto.current_price;
    const currencyRate = currencyRates[currencyCode];
    const priceInSelectedCurrency = currencyRate
      ? (priceInUSD * currencyRate).toFixed(2)
      : priceInUSD.toFixed(2);

    const priceElement = document.getElementById(`price-${crypto.id}`);
    priceElement.textContent = `${
      currencyRate ? currencyCode.toUpperCase() : "USD"
    } ${priceInSelectedCurrency} || $${priceInUSD}`;
  });
};

document.addEventListener("keydown", function (event) {
  if ((event.ctrlKey || event.metaKey) && event.key === "/") {
    event.preventDefault();
    searchBar.focus();
  }
});
