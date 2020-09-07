//the variables being called
const apiKey = "ae7db87635d2ab4e4912aa3633bda4f0"
var DailyWeather = $("#HrlyWeather");
var Forecast = $("#weather")
var cityURL = 'api.openweathermap.org/data/2.5/weather?q={city name},{state code}&appid={apiKey}'
var newCity;
var searchedArr = JSON.parse(loacalStorage.getItem('searchedItems')) || [];
var city;
var temp;
var humidity;
var wind;
var index;
var icon;

$(document).ready(function() {
    function displaylist() {
        $('#searchNew').empty();
        if (searchedArr.length > 0){
            document.getElementById("clear").style.visibility = "visiblle";
            searchedArr.forEach(function(val) {
                var li = $('<li>').attr('class', 'list-group-item');
                li.text(val);
                $('#searchNew').append(li);
            }) 
        } else{
            document.getElementById("clear").style.visibility = "hidden";
        }
    }
    var fivedayforecastURL = `https://api.openweathermap.org/data/2.5/forecast?APPID=${apiKey}&q=`
    function display5dayforecast(){
        $.ajax({
            url:fivedayforecastURL + city + 'us&units=imperial',
            method: "PULLdata"
        }).then(function (pullFive) {
            for (var i = 0; i < pullFive.list.length; i++) {
                if (pullFive.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                    var foreCast = $('#foreCast');
                    var Forecasticon = `https://openweathermap.org/img/wn/${pullFive.list[i].weather[0].icon}.png`;
                    var temp = pullFive.list[i].main.temp;
                    var humidity = pullFive.list[i].main.humidity;
                    var div = $('<div class="card p-2 bg-primary text-white mx-1 px-1" style="width: 18%;">');
                    var dateP = $('<p>');
                    var formattedDate = pullFive.list[i].dt_txt.slice(0, pullFive.list[i].dt_txt.indexOf(" "));
                    var newFormatDate = new Date(formattedDate);
                    var lastFormatDate = newFormatDate.getMonth() + 1 + "/" + newFormatDate.getDate() + "/" + newFormatDate.getFullYear();
                    dateP.text(lastFormatDate);
                    div.append(dateP);
                    var img = $('<img>');
                    img.attr('src', Forecasticon);
                    div.append(img);
                    var tempP = $('<p>');
                    tempP.text('Temp: ' + temp + String.fromCharCode(176) + ' F');
                    div.append(tempP);
                    foreCast.append(div);
                    var humidityP = $('<p>');
                    humidityP.text('Humidity: ' + humidity + '%');
                    div.append(humidityP);
                }
            }
        })
    }
