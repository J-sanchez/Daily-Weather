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
    