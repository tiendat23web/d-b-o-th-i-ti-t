const input = document.querySelector(".searhi-input");
const searchBtn = document.querySelector(".search-icon");

// Sự kiện enter và click trong input
searchBtn.addEventListener("click", fetchWeatherData);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    fetchWeatherData();
  }
});

async function fetchWeatherData() {
  const cityName = input.value;
  const apiKey = "5b6bbe5f514928962b3726c6b6955d9d";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric&lang=vi`;
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();

    // Lấy giá trị từ API
    const nameCity = data.name;
    const tempValue = Math.round(data.main.temp);
    const feelsLikeValue = Math.round(data.main.feels_like);
    const descriptionValue = data.weather[0].description;
    const weather = data.weather[0].main;
    const backgroundValue = getBackground(weather);
    const iconAPI = data.weather[0].icon;
    const weatherIconHTML = getIcon(iconAPI);

    const location = document.querySelector(".left-location p");
    const temp = document.querySelector(".left-temperature-value");
    const description = document.querySelector(".left-temperature-description");
    const feelsLike = document.querySelector(".fill-value");
    const background = document.querySelector(".background");
    const icon = document.querySelector(".temperature-icon");

    function getBackground(weather) {
      switch (weather) {
        case "Clear":
          return "acssec/nang.jpg";
        case "Clouds":
          return "acssec/may.jpg";
        case "Rain":
          return "acssec/mua.jpg";
        case "Snow":
          return "acssec/tuyet.jpg";
        case "Drizzle":
          return "acssec/mua.jpg";
        case "Thunderstorm":
          return "acssec/bao.jpg";
        case "Mist":
        case "Fog":
          return "acssec/mua.jpg";
        default:
          return "acssec/nang.jpg";
      }
    }

    function getIcon(icon) {
      switch (icon) {
        case "01n":
          return `<i class="fa-solid fa-moon"></i>`;
        case "02n":
        case "03n":
          return `<i class="fa-solid fa-cloud-moon"></i>`;
        case "09n":
        case "10n":
          return `<i class="fa-solid fa-cloud-moon-rain"></i>`;
        case "01d":
          return `<i class="fa-solid fa-sun"></i>`;
        case "02d":
        case "03d":
          return `<i class="fa-solid fa-cloud-sun"></i>`;
        case "04d":
        case "04n":
          return `<i class="fa-solid fa-cloud"></i>`;
        case "09d":
          return `<i class="fa-solid fa-cloud-sun-rain"></i>`;
        case "10d":
        case "10n":
          return `<i class="fa-solid fa-cloud-showers-heavy"></i>`;
        case "11d":
        case "11n":
          return `<i class="fa-solid fa-tornado"></i>`;
        case "13d":
        case "13n":
          return `<i class="fa-solid fa-snowflake"></i>`;
        default:
          return `<i class="fa-solid fa-cloud"></i>`;
      }
    }

    // Gán giá trị vào DOM
    location.innerHTML = nameCity;
    temp.innerHTML = tempValue + "&deg;";
    description.innerHTML = descriptionValue;
    feelsLike.innerHTML = feelsLikeValue + "&deg;";
    background.style.backgroundImage = `url(${backgroundValue})`;
    icon.innerHTML = weatherIconHTML;
  } catch (error) {
    window.alert(error);
  }
  set5Day(cityName);
}

function set5Day(value) {
  // Tạo đối tượng Date cho ngày hôm nay
  let today = new Date();

  // Mảng chứa tên các thứ trong tuần
  const daysOfWeek = [
    "Chủ Nhật",
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
  ];

  const apiKey = "5b6bbe5f514928962b3726c6b6955d9d"; 
  const city = value;
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error("Lỗi API");
      return response.json();
    })
    .then((data) => {
      const forecastList = data.list;
      const dailyData = {};

      // Nhóm dữ liệu theo ngày
      forecastList.forEach((item) => {
        const date = new Date(item.dt * 1000);
        const dayKey = date.toLocaleDateString("vi-VN", {
          weekday: "long",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });

        if (!dailyData[dayKey]) {
          dailyData[dayKey] = [];
        }
        dailyData[dayKey].push(item.main.temp);
      });

      // Tính min/max cho từng ngày
      const dailyMinMax = {};
      for (const day in dailyData) {
        const temps = dailyData[day];
        dailyMinMax[day] = {
          min: Math.min(...temps).toFixed(0),
          max: Math.max(...temps).toFixed(0),
        };
      }
      

      // Lặp qua 5 ngày tiếp theo
      for (let i = 1; i <= 5; i++) {
        // Tạo một đối tượng Date mới cho ngày tiếp theo
        let nextDate = new Date(today);
        nextDate.setDate(today.getDate() + i);
      
        // Lấy thứ của ngày tiếp theo
        let dayOfWeek = daysOfWeek[nextDate.getDay()];
        const getDay = document.querySelector(
          `.day-container .container-item:nth-child(${i})`
        );
      
        if (getDay) {
          const getDateOfWeeK = getDay.querySelector(".container-item-day");
          const gettempday = getDay.querySelector(".container-item-temp p");
      
          // Gán thứ vào DOM
          getDateOfWeeK.innerHTML = dayOfWeek;
      
          // Lấy giá trị max và min từ dailyMinMax
          const dayKey = nextDate.toLocaleDateString("vi-VN", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
      
          if (dailyMinMax[dayKey]) {
            const { max, min } = dailyMinMax[dayKey];
            gettempday.innerHTML = `${min}&deg; / ${max}&deg;`; // Gán giá trị max/min vào DOM
          } else {
            gettempday.innerHTML = "N/A"; // Nếu không có dữ liệu, hiển thị N/A
          }
          const tempMain = document.querySelector(".min-max");
          tempMain.innerHTML = `${dailyMinMax[dayKey].min}&deg; / ${dailyMinMax[dayKey].max}&deg;`;
        } else {
          console.error(`Không tìm thấy phần tử cho ngày thứ ${i}`);
        }
      }
    })
    .catch((error) => console.error("Lỗi:", error));
}
