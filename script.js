let weather = {
    apiKey: "0217920b74c05bcbb0c87706688f4788",
    fetchWeather: function (city) {
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + this.apiKey
        ).then((response) => response.json()).then((data) => this.displayWeather(data));
    },

    displayWeather: function(data) {
        const { name } = data;
        const { description, icon} = data.weather[0];
        const {temp, humidity} = data.main;
        const {speed} = data.wind;
        
        document.querySelector('.city-name').innerText = name;
        document.querySelector('.degrees').innerText = Math.floor(temp) + '°';
        document.querySelector('.description').innerText = description;
        console.log(name, description, icon, temp, humidity, speed);
    },

    fetchForecast: function (city) {
        fetch(
            "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=metric&appid=" + this.apiKey
        ).then((response) => response.json()).then((data) => this.display3HourForecast(data))
    },

    display3HourForecast: function (data) {
        const dates = [];
        const temps = [];
        const icons = [];

        //loading data from api
        for (let i=1; i<=8;i++) {
            dates[i] = data.list[i].dt_txt;
            temps[i] = data.list[i].main.temp;
            icons[i] = data.list[i].weather[0].icon;
        }

        //displaying data
        for (let i=1; i<=8; i++) {
            document.querySelector('#icon-id-' + i).src = "https://openweathermap.org/img/wn/" + icons[i] + "@2x.png";
            
            var hour = dates[i].split(" ");
            hour = hour[1].slice(0,2);
            document.querySelector("#hour-id-" + i).innerText = hour;

            var temp = Math.floor(temps[i]);
            document.querySelector("#temp-id-" + i).innerText = temp + "°";

            console.log(hour);
        }


        console.log(temps, dates,icons);
        
    }
};