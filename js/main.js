const hour = new Date().getHours();
const amOrPm = hour >= 12 ? "PM" : "AM";
const date = (hour % 12 || 12) + ` : ${new Date().getMinutes()}`;
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Search Function...
document.querySelector(".form-control").addEventListener("input", function () {
  this.parentElement.parentElement.style.position = "relative";
  this.parentElement.parentElement.style.zIndex = "9999";
  if(this.value.length>=3) callData(this.value);
});
// Get Located City Forecast Function...
function getLocation() {
  return new Promise(function () {
    navigator.geolocation.getCurrentPosition(function (location) {
      const lat = location.coords.latitude;
      const long = location.coords.longitude;
      try {
        let data = new XMLHttpRequest();
        data.open(
          "get",
          `https://api.weatherapi.com/v1/forecast.json?key=7c785214ae834d51b54153720242506&q=${lat},${long}&days=3&aqi=yes`
        );
        data.send();
        data.addEventListener("loadend", function () {
          if (data.status == 200) {
            let allData = JSON.parse(data.response);
            display(allData);
            document.querySelector(".loading").classList.add("d-none");
            return allData;
          }
        });
      } catch (error) {
        console.log("error");
      } finally {
        document.querySelector(".loading").classList.remove("d-none");
      }
    });
  });
}
async function callLocation() {
  await getLocation();
}
document.getElementById("currLocarion").addEventListener("click", callLocation);
// Get Search City Weather Function...
function getData(city) {
  return new Promise(function () {
    try {
      let data = new XMLHttpRequest();
      data.open(
        "get",
        `https://api.weatherapi.com/v1/forecast.json?key=7c785214ae834d51b54153720242506&q=${city}&days=3&aqi=yes`
      );
      data.send();
      data.addEventListener("loadend", function () {
        if (data.status == 200) {
          let allData = JSON.parse(data.response);
          display(allData);
          document.querySelector(".loading").classList.add("d-none");
          return allData;
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      document.querySelector(".loading").classList.remove("d-none");
    }
  });
}
async function callData(city) {
  await getData(city);
}
//   Display Function...
function display(data) {
  // 2 Days Dates...
  const secDateP1 = `${new Date(data.forecast.forecastday[1].date).getDate()} ${
    months[new Date(data.forecast.forecastday[1].date).getMonth()]
  }`;
  const secDateP2 =
    weekDays[new Date(data.forecast.forecastday[1].date).getDay()];

  const thirDateP1 = `${new Date(
    data.forecast.forecastday[2].date
  ).getDate()} ${
    months[new Date(data.forecast.forecastday[2].date).getMonth()]
  }`;
  const thirDateP2 =
    weekDays[new Date(data.forecast.forecastday[2].date).getDay()];
  // Display Main Section...
  document.querySelector(".current").innerHTML = `
            <div class="inner rounded-5 px-3 py-4">
              <div class="location fs-5">
                <i class="fa-solid fa-location-dot mb-3"></i> ${data.location.name}, ${data.location.region},
                ${data.location.country}
              </div>
              <div class="date text-white-50">${date} ${amOrPm}</div>
              <figure class="text-center">
                <img src="${data.current.condition.icon}" loading="lazy" alt="weather condition" width="150" height="150"/>
              </figure>
              <div class="degree text-center">
                <div class="max fs-2">${data.current.temp_c} <sup>o</sup>C</div>
                <div class="min fs-5">${data.forecast.forecastday[0].day.mintemp_c} <sup>o</sup>C</div>
              </div>
              <div class="desc mt-3 fs-5 d-flex align-items-center">
                <img src="${data.current.condition.icon}" loading="lazy"  alt="weather condition"/>
                <span class="ms-3">${data.current.condition.text}</span>
              </div>
              <hr />
              <div class="sun">
                <div class="title fs-5">Sunrise & Sunset</div>
                <div
                  class="row display d-flex justify-content-between align-items-center gy-2"
                >
                  <div
                    class="col-6 item d-flex justify-content-center align-items-center py-4"
                  >
                    <div>
                      <i class="fa-regular fa-sun fs-2"></i>
                    </div>
                    <div class="d-flex flex-column ms-3">
                      <span class="text-white-50">Sunrise</span>
                      <span class="text-white fs-5"
                        >${data.forecast.forecastday[0].astro.sunrise}</span
                      >
                    </div>
                  </div>
                  <div
                    class="col-6 item d-flex justify-content-center align-items-center"
                  >
                    <div>
                      <i
                        class="fa-regular fa-moon fs-2"
                      ></i>
                    </div>
                    <div class="d-flex flex-column ms-3">
                      <span class="text-white-50">Sunset</span>
                      <span class="text-white fs-5"
                        >${data.forecast.forecastday[0].astro.sunset}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `;
  document.querySelector(
    ".highlights"
  ).innerHTML = `<div class="title fs-4 fw-medium">Today Highlights</div>
              <div class="col-lg-4 col-sm-6 humidity mt-3">
                <div class="inner rounded-5 px-3 py-2">
                  <span class="text-white-50">Humididty</span>
                  <div
                    class="text-white mt-2 d-flex justify-content-between align-items-center"
                  >
                    <span><i class="fa-solid fa-droplet fs-4"></i></span>
                    <span class="fs-4">${data.current.humidity} %</span>
                  </div>
                </div>
              </div>
              <div class="col-lg-4 col-sm-6 pressure mt-3">
                <div class="inner rounded-5 px-3 py-2">
                  <span class="text-white-50">Pressure</span>
                  <div
                    class="text-white mt-2 d-flex justify-content-between align-items-center"
                  >
                    <span><i class="fa-solid fa-water fs-4"></i></span>
                    <span class="fs-4">${data.current.pressure_mb} Mb</span>
                  </div>
                </div>
              </div>
              <div class="col-lg-4 col-sm-6 visibility mt-3">
                <div class="inner rounded-5 px-3 py-2">
                  <span class="text-white-50">Visibility</span>
                  <div
                    class="text-white mt-2 d-flex justify-content-between align-items-center"
                  >
                    <span><i class="fa-solid fa-eye fs-4"></i></span>
                    <span class="fs-4">${data.current.vis_km} Km</span>
                  </div>
                </div>
              </div>
              <div class="col-lg-4 col-sm-6 feels mt-3">
                <div class="inner rounded-5 px-3 py-2">
                  <span class="text-white-50">Feels Like</span>
                  <div
                    class="text-white mt-2 d-flex justify-content-between align-items-center"
                  >
                    <span
                      ><i class="fa-solid fa-temperature-quarter fs-4"></i
                    ></span>
                    <span class="fs-4">${data.current.feelslike_c} <sup>o</sup>C</span>
                  </div>
                </div>
              </div>
              <div class="col-lg-8 col-sm-12 wind mt-3">
                <div class="inner rounded-5 px-3 py-2">
                  <span class="text-white-50">Wind</span>
                  <div class="row display d-flex justify-content-between">
                    <div
                      class="col-6 text-white mt-2 d-flex justify-content-between align-items-center"
                    >
                      <span><i class="fa-solid fa-wind fs-4"></i></span>
                      <span class="fs-4">${data.current.wind_kph} Km/h</span>
                    </div>
                    <div
                      class="col-5 text-white mt-2 d-flex justify-content-between align-items-center"
                    >
                      <span><i class="fa-regular fa-compass fs-4"></i></span>
                      <span class="fs-4">${data.current.wind_dir}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>`;
  document.querySelector(
    ".other-days"
  ).innerHTML = `<div class="col-12 title fs-4 fw-medium mb-2">2 Days Forecasts</div>
              <div class="col-sm-5">
                <div class="inner rounded-5 px-3 py-4">
                  <div class="date mb-3 d-flex justify-content-between">
                    <div>${secDateP2}</div>
                    <div>${secDateP1}</div>
                  </div>
                  <div class="display-data">
                    <figure class="text-center">
                      <img src="${data.forecast.forecastday[1].day.condition.icon}" loading="lazy" alt="weather condition"/>
                    </figure>
                    <div
                      class="degree text-center d-flex justify-content-between align-items-center"
                    >
                      <div class="max fs-3">${data.forecast.forecastday[1].day.maxtemp_c} <sup>o</sup>C</div>
                      <div class="min fs-5">${data.forecast.forecastday[1].day.mintemp_c} <sup>o</sup>C</div>
                    </div>
                    <div class="desc text-center fs-5">${data.forecast.forecastday[1].day.condition.text}</div>
                  </div>
                </div>
              </div>
              <div class="col-sm-5">
                <div class="inner rounded-5 px-3 py-4">
                  <div class="date mb-3 d-flex justify-content-between">
                    <div>${thirDateP2}</div>
                    <div>${thirDateP1}</div>
                  </div>
                  <div class="display-data">
                    <figure class="text-center">
                      <img src="${data.forecast.forecastday[2].day.condition.icon}" loading="lazy" alt="weather condition"/>
                    </figure>
                    <div
                      class="degree text-center d-flex justify-content-between align-items-center"
                    >
                      <div class="max fs-3">${data.forecast.forecastday[2].day.maxtemp_c} <sup>o</sup>C</div>
                      <div class="min fs-5">${data.forecast.forecastday[2].day.mintemp_c} <sup>o</sup>C</div>
                    </div>
                    <div class="desc text-center fs-5">${data.forecast.forecastday[2].day.condition.text}</div>
                  </div>
                </div>
              </div>
            </div>`;
}
callLocation();
