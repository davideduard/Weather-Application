let weather = {
    apiKey: "0217920b74c05bcbb0c87706688f4788",
    new_source: "",

    fetchWeather: function (lat, lon) {
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=metric&appid=" + this.apiKey
        ).then((response) => response.json()).then((data) => this.displayWeather(data));
    },


    displayWeather: function(data) {
        const { name } = data;
        const { description, icon, main } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;
        
        document.querySelector('.city-name').innerText = name;
        document.querySelector('.degrees').innerText = Math.round(temp) + '°';
        document.querySelector('.description').innerText = description;
        document.querySelector('.wind').innerText = Math.round(speed) + "Km/h Wind speed";
        document.querySelector('.humidity').innerText = Math.round(humidity) + "% Humidity";
        

        let video = document.getElementById('video');

        let day_time = icon.slice(2,3);
        this.new_source = "";

        if (main == "Clear" && day_time == "d") {
            weather.new_source = "resources/sunny.mp4";
        }

        if (main == "Clear" && day_time == "n") {
            weather.new_source = "resources/starry-night.mp4";
        }

        if (main == "Rain" || main=="Drizzle") {
            weather.new_source = "resources/rain.mp4";
        }

        if (main == "Clouds" && description == "overcast clouds") {
            weather.new_source = "resources/clouds.mov";
        }

        if (main == "Clouds" && day_time == "d") {
            weather.new_source = "resources/test.mov";
        }

        if (main == "Clouds" && day_time == "n") {
            weather.new_source = "resources/night-clouds.mov";
        }

        if (main == "Snow") {
            weather.new_source = "resources/snowfall.mp4";
        }

        if (main == "Thunderstorm") {
            weather.new_source = "resources/thunderstorm.mp4"
        }

        let existingSource = video.querySelector('source');
        if (existingSource) {
            video.removeChild(existingSource);
        }

        let source = document.createElement('source');

        source.setAttribute('src', weather.new_source)
        video.appendChild(source);
        video.load();
        video.addEventListener('canplaythrough', function (){
            video.play();
        });
    },

    fetchForecast: function (lat, lon) {
        fetch(
            "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=metric&appid=" + this.apiKey
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

    fetchDailyForecast: function (lat, lon) { 
        fetch(
            "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=metric&appid=" + this.apiKey
        ).then((response) => response.json()).then((data) => this.displayDailyForecast(data))
    },

    displayDailyForecast: function(data) {

        var curent_date = "";
        var min_temp = data.list[0].main.temp_min;
        var max_temp = data.list[0].main.temp_max;
        const min_temps = [];
        const max_temps = [];
        const icons = [];
        var dates = [];
        const descriptions = [];
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
            }

            if (data.list[i].sys.pod == "d" && (date_step[1] == "00:00:00" || date_step[1] == "12:00:00")) {
                icons[step] = data.list[i].weather[0].icon;
                descriptions[step] = data.list[i].weather[0].description;
            }
        }
        

        //if the clock goes over some hour, the dates don't log the first date
        if (dates.length == 6){
            dates.shift();
            icons.shift();
            descriptions.shift();
        }

        //we display the information provided earlier
        for (let i=1;i<=4;i++) {
            document.querySelector('#day-id-' + i).innerText = this.getDayName(new Date(dates[i]));
            document.querySelector('#low-id-' + i).innerText = "L: " + min_temps[i] + "°";
            document.querySelector('#high-id-' + i).innerText = "H: " + max_temps[i] + "°";
            document.querySelector("#day-icon-id-" + i).src = "https://openweathermap.org/img/wn/" + icons[i] + "@2x.png"
            document.querySelector("#desc-id-" + i).innerText = descriptions[i];
        }
    },

    search: function() {
        const city = document.querySelector("#search-bar").value;
        document.querySelector("#search-bar").value = "";
        
        fetch(
            "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=5&appid=" + this.apiKey
        ).then((response) => response.json()).then((data) => {
            
            weather.fetchWeather(data[0].lat, data[0].lon)
            weather.fetchForecast(data[0].lat, data[0].lon)
            weather.fetchDailyForecast(data[0].lat, data[0].lon)
        })
    
    }
};

document.addEventListener("keydown", (event) => {
    if (event.key == "Enter"){
        weather.search();
    }
})

const success = (position) => {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    weather.fetchWeather(lat, lon)
    weather.fetchForecast(lat, lon);
    weather.fetchDailyForecast(lat, lon)
};

window.onload = function() {
    navigator.geolocation.getCurrentPosition(success)
};