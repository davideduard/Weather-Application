let weather = {
    apiKey: "0217920b74c05bcbb0c87706688f4788",
    fetchWeather: function (city) {
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + this.apiKey
        ).then((response) => response.json()).then((data) => this.displayWeather(data));
    },

    displayWeather: function(data) {
        const { name } = data;
        const { description, icon, main} = data.weather[0];
        const {temp, humidity} = data.main;
        const {speed} = data.wind;
        
        document.querySelector('.city-name').innerText = name;
        document.querySelector('.degrees').innerText = Math.floor(temp) + '°';
        document.querySelector('.description').innerText = description;
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
        }       
    },

    getDayName: function(date = new Date(), locale = 'en-US') {
        return date.toLocaleDateString(locale, {weekday: 'short'});
    },

    fetchDailyForecast: function (city) { 
        fetch(
            "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=metric&appid=" + this.apiKey
        ).then((response) => response.json()).then((data) => this.displayDailyForecast(data))
    },

    displayDailyForecast: function(data) {

        var curent_date = "";
        var min_temp = data.list[0].main.temp_min;
        var max_temp = data.list[0].main.temp_max;
        const min_temps = [];
        const max_temps = [];
        const icons = [];
        const dates = [];
        var step = 0;
        

        //we search for min and max temps, day icons and we save the dates for the different days
        for (let i=1; i<40; i++) {
            var date_step = data.list[i].dt_txt.split(" ");
            if (curent_date[0] != date_step[0]){
                min_temps[step] = Math.round(min_temp);
                max_temps[step] = Math.round(max_temp);
                dates[step] = curent_date[0];
                step += 1;

                curent_date = data.list[i].dt_txt.split(" ");
                min_temp = data.list[i].main.temp_min;
                max_temp = data.list[i].main.temp_max;
            }
            else {
                if (data.list[i].main.temp_min < min_temp)
                    min_temp = data.list[i].main.temp_min;
                if (data.list[i].main.temp_max > max_temp)
                    max_temp = data.list[i].main.temp_max;
                if (data.list[i].sys.pod == "d"){
                    icons[step] = data.list[i].weather[0].icon
                }
            }
        }

        //we display the information provided earlier
        for (let i=1;i<=4;i++) {
            document.querySelector('#day-id-' + i).innerText = this.getDayName(new Date(dates[i]));
            document.querySelector('#low-id-' + i).innerText = "L: " + min_temps[i] + "°";
            document.querySelector('#high-id-' + i).innerText = "H: " + max_temps[i] + "°";
            document.querySelector("#day-icon-id-" + i).src = "https://openweathermap.org/img/wn/" + icons[i] + "@2x.png" 
        }
    }
};

window.onload = function() {
    weather.fetchWeather("Bucharest");
    weather.fetchForecast("Bucharest");
    weather.fetchDailyForecast("Bucharest")
};