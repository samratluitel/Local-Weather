var latitude;
var longitude;
var address;
//main
var time,pressure,temp,humidity,temp_min,temp_max,sea_level,grnd_level;
//wind
var speed,deg;
var sunrise,sunset;
var icon,description;
var sky;
//gets the geolocation
var getLocationData = function(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            console.log(latitude,longitude);
            var url= `http://maps.googleapis.com/maps/api/geocode/json?sensor=false&language=en&latlng=${latitude},${longitude}`;
            $.get(url).done(function(data){
                //gets the address
                console.log(data);
                address=`${data.results[1].address_components[0].long_name},${data.results[1].address_components[1].long_name}`;
                var timeurl=`http://api.timezonedb.com/v2/get-time-zone?key=FL92YD6NC2Z3&format=json&by=position&lat=${latitude}&lng=${longitude}`;
                $.get(timeurl).done(function(data){
                    //gets the time of that address
                    time=data.formatted;
                    time=changeTimeFormat(time);
                    GetTemperatureData();
                }).fail(function(e){
                    alert("Oops some error occured. Try reloading");
                })
            }).fail(function(e){
                alert("Oops some error occured. Try reloading");
            })
        });
    } else {
        
    }
}

function GetTemperatureData(){
    var url=`https://fcc-weather-api.glitch.me/api/current?lat=${latitude}&lon=${longitude}`;
    $.get(url)
    .done(function(data){
        GetTemperatureVariable(data);
        updateWeatherData();
    })
    .fail(function(e){
        alert("Oops some error occured. Try reloading the browser");
    })
}
function GetTemperatureVariable(data){
        description=data.weather[0].description;
        icon = data.weather[0].icon;
        temp=data.main.temp;
        pressure=data.main.pressure;
        humidity=data.main.humidity;
        temp_min=data.main.temp_min;
        sea_level=data.main.sea_level;
        console.log(data.main.sea_level);
        grnd_level=data.main.grnd_level;
        speed=data.wind.speed;
        temp_max =data.main.temp_max;
        deg=data.wind.deg;
        sunrise=UnixToHour(data.sys.sunrise);
        sunset=UnixToHour(data.sys.sunset);
        sky=data.weather[0].main;
}
function UnixToHour(unix_timestamp){
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    var date = new Date(unix_timestamp*1000);
    // Hours part from the timestamp
    var hours = date.getHours();
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    var seconds = "0" + date.getSeconds();

    // Will display time in 10:30:23 format
    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formattedTime;
}

function changeTimeFormat(time){
    //Removes the second from the API time
    var timearr = time.split('');
    var splicedtime = timearr.splice(0,16);
    return splicedtime.join('');  
}

var updateWeatherData = function(){
    console.log(address,time,temp);
    $("#current-location").text(address);
    $("#current-time").text(time);
    $("#temp").text(temp);
    if(sky=="Clear"){
        $("#weather-icon").html("<i class='wi wi-day-sunny'></i>");
    }else{
        $("#weather-icon").html("<i class='wi wi-day-cloudy'></i>");
    }
    $("#wind-speed").text(speed+"km/hr");
    $("#wind-degree").text(deg);
    if(speed>3){
        $("#wind-icon").html("<i class='wi wi-day-windy'></i>");
    }else{
        $("#wind-icon").html("<i class='wi wi-day-light-wind'></i>");
    }
    console.log(sea_level);
    $("#humidity").text(humidity);
    $("#sunrise").text(sunrise);
    $("#sunset").text(sunset);
    $("#max-temp").text(temp_max);
    $("#pressure").text(pressure);
}
 getLocationData();