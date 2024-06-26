// search input
const cityInput = document.querySelector("input"); //only one
//  for display output
const month = document.querySelectorAll(".day-num"); //only one
const city = document.querySelector(".city"); //only one
const currentTem = document.querySelector(".current-deg"); //only one
const deg = document.querySelectorAll(".deg"); //3
const dateName = document.querySelectorAll(".day-name"); //3
const icon = document.querySelectorAll(".w-icon img"); //3
const state = document.querySelectorAll(".w-state"); //3
const maxTem = document.querySelectorAll(".max-deg"); //2
const minTem = document.querySelectorAll(".min-deg"); //2
const wValues = document.querySelectorAll(".w-values");
// small screen menu
const menu = document.querySelector(".bars");
const navList = document.querySelector(".nav-list ul");

// api keys
const weatherKey = "3f592d6c294a450bbfc193314242006";
const locationKey = "pk.91679180fe65908fe1bd8af2f1580ff2";

// full name for week days
const weekDays = {
  Sun: "Sunday",
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
};

// full name for wind directions
const windDirections = {
  N: "North",
  S: "South",
  E: "East",
  W: "West",
  NE: "Northeast",
  NW: "Northwest",
  SE: "Southeast",
  SW: "Southwest",
  NNE: "North-Northeast",
  NNW: "North-Northwest",
  ENE: "East-Northeast",
  ESE: "East-Southeast",
  SSE: "South-Southeast",
  SSW: "South-Southwest",
  WNW: "West-Northwest",
  WSW: "West-Southwest",
};

// when page is loaded
getLocation();

// get location's Coordinates
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(locationDetermine);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

// get location name
async function locationDetermine(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  const apiURL = `https://us1.locationiq.com/v1/reverse?key=${locationKey}&lat=${lat}&lon=${lon}&format=json&`;
  const data = await fetchData(apiURL);
  const cityName = data.address.state;
  getWeather(cityName);
}

// when user searches
cityInput.addEventListener("input", () => {
  if (cityInput.value.length >= 3) {
    query = cityInput.value;
    getWeather(query);
  }
});

// get weather &display it
async function getWeather(query) {
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${weatherKey}&q=${query}&days=3`;
  const data = await fetchData(url);
  const current = data.current;
  const days = data.forecast.forecastday;

  // display results in dom
  // div 1 current
  city.innerHTML = data.location.name;
  let div1Date = dateFormat(days[0].date, true);
  dateName[0].innerHTML = div1Date.dayFullName;
  month[0].innerHTML = div1Date.secFormate;
  currentTem.innerHTML = current.temp_c;
  icon[0].src = "https:" + current.condition.icon;
  state[0].innerHTML = current.condition.text;
  // rain & wind & direction
  wValues[0].innerHTML = days[0].day.daily_chance_of_rain + "%";
  wValues[1].innerHTML = current.wind_kph + "km/h";
  wValues[2].innerHTML = windDirections[current.wind_dir];

  // div 2 &3
  for (i = 1; i < 3; i++) {
    dateName[i].innerHTML = dateFormat(days[i].date, false);
    maxTem[i - 1].innerHTML = days[i].day.maxtemp_c;
    minTem[i - 1].innerHTML = days[i].day.mintemp_c;
    icon[i].src = "https:" + days[i].day.condition.icon;
    state[i].innerHTML = days[i].day.condition.text;
  }
}

// send req and get the data
async function fetchData(apiURL) {
  try {
    const response = await fetch(apiURL);

    if (!response.ok) {
      throw new Error("network response was not ok" + response.statusText);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      "There was a problem with determine the current location:",
      error
    );
  }
}

// chancing the date format
function dateFormat(apiDate, div1) {
  var dateArray = new Date(apiDate).toString().split(" ");
  let dayFullName = weekDays[dateArray[0]];
  let secFormate = `${dateArray[2]}${dateArray[1]}`;

  if (div1) {
    return { dayFullName: dayFullName, secFormate: secFormate };
  }
  return dayFullName;
}


menu.addEventListener("click", () => {
  if (navList.style.height == "0px") {
    navList.style.height = "317px";
  } else {
    navList.style.height = "0px";
  }
});

