document.addEventListener("DOMContentLoaded", function() {
    const ipAddressElement = document.getElementById("ip-address");
    const cityElement = document.getElementById("city");
    const ispElement = document.getElementById("isp");
    const weatherElement = document.getElementById("weather");

    // Replace 'YOUR_IPINFO_API_KEY' with your actual ipinfo.io API key
    const ipinfoApiKey = "00fbc71f8f38cc";
    const ipinfoApiUrl = `https://ipinfo.io/json?token=${ipinfoApiKey}`;

    fetch(ipinfoApiUrl)
        .then(response => response.json())
        .then(data => {
            const { ip, city, country, org, loc } = data;
            ipAddressElement.textContent = `Your IP Address: ${ip}`;
            ispElement.textContent = `Your Internet Provider: ${cleanISPName(org)}`;
            const countryName = getCountryName(country);
            const countryFlag = getCountryFlagEmoji(country);
            const greeting = getLocalGreeting(country);
            cityElement.innerHTML = `You are from: ${city}, ${countryName} ${countryFlag} (${greeting} 👋)`;

            const [latitude, longitude] = loc.split(',');
            displayMap(latitude, longitude);

            fetchWeather(city, country);
        })
        .catch(error => {
            console.error("Error fetching IP information:", error);
            ipAddressElement.textContent = "Unable to fetch IP address.";
            cityElement.textContent = "";
            ispElement.textContent = "";
            weatherElement.textContent = "";
        });
});

function cleanISPName(org) {
    // Remove any unwanted prefixes or text before the ISP name
    // Example: "AS1234 - My ISP" becomes "My ISP"
    return org.split(" - ").pop();
}

function getCountryName(countryCode) {
    const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
    return regionNames.of(countryCode);
}

function getCountryFlagEmoji(countryCode) {
    const codePoints = countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
}

function getLocalGreeting(countryCode) {
    const greetings = {
        "US": "Hello",
        "FR": "Bonjour",
        "ES": "Hola",
        "DE": "Hallo",
        "JP": "こんにちは",
        "CN": "你好",
        "IN": "नमस्ते"
        "IR": "سلام,
        "BD": "স্বাগতম"
    };
    return greetings[countryCode] || "Hello";
}

function displayMap(latitude, longitude) {
    const map = L.map('map').setView([latitude, longitude], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([latitude, longitude]).addTo(map);
}

function fetchWeather(city, country) {
    const weatherApiKey = "c56366569f234c13919192259242807"; // Replace with your WeatherAPI key
    const weatherApiUrl = `http://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${city},${country}`;

    fetch(weatherApiUrl)
        .then(response => response.json())
        .then(data => {
            const { current } = data;
            const temperature = current.temp_c;
            const description = current.condition.text;
            weatherElement.innerHTML = `Your Weather Now is: ${temperature}°C, ${description}`;
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            weathe
