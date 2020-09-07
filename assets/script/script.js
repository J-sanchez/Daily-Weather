//the variables being called
var apiKey = "ae7db87635d2ab4e4912aa3633bda4f0"
var DailyWeather = $("#HrlyWeather");
var Forecast = $("#weather")
var cityURL = `https://api.openweathermap.org/data/2.5/weather?APPID=${apiKey}&q=`
var newCity;
var searchedArr = JSON.parse(localStorage.getItem('searchedItems')) || [];
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

    function returnUVIndex(coordinates) {
        var cityUV = `https://api.openweathermap.org/data/2.5/uvi?lat=${coordinates.lat}&lon=${coordinates.lon}&APPID=${apiKey}`;
    
        $.get(cityUV).then(function(response){
            let currUVIndex = response.value;
            if (currUVIndex >= 11) {
                uvSeverity = "red";
            } else if (currUVIndex >= 8) {
                uvSeverity = "orange";
            } else if (currUVIndex >= 6) {
                uvSeverity = "yellow";
                textColour = "black"
            } else if (currUVIndex >= 3) {
                uvSeverity = "green";
                textColour = "black"
            }
            currWeatherDiv.append(`<p>UV Index: <span class="text-${textColour} uvPadding" style="background-color: ${uvSeverity};">${currUVIndex}</span></p>`);
        })


    function getResults(searchedCity) {
        if (!searchedCity) {
            var searchedCity = $('#city').val();
        }
        //console.log(searchedCity)
        if(searchedCity !== ""){
            $.ajax({
                url: cityURL + searchedCity + ',us&units=imperial',
                method: "GET"
            }).then(function (response) {
                //console.log(response);
                //get lattitue and longitude for searched UV index
                var lat = response.coord.lat;
                var lon = response.coord.lon;
                $.ajax({
                    url: cityUV + `&lat=${lat}&lon=${lon}`,
                    method: "GET"
                }).then(function (data) {
                    //set a value for the current UV index.
                    index = data.value;
                    //clear search field
                    $('#city').val(" ");
                    //display results
                    displayDashbord();
                    displaylist();
                })
                if (searchedArr.length > 0) {
                    if (searchedArr.indexOf(searchedCity) === -1) {
                        searchedArr.push(searchedCity.toUpperCase());
                    }else {
                        $('#clear').attr('visbility', true)
                    }
                } else {
                    searchedArr.push(searchedCity.toUpperCase());
                }
                localStorage.setItem('searchedItems', JSON.stringify(searchedArr));
                city = searchedCity;
                temparature = response.main.temp;
                humidity = response.main.humidity;
                wind = response.wind.speed;
                icon = `https://openweathermap.org/img/wn/${response.weather[0].icon}.png`;
            }).catch(function (error) {
            })
        }
    }

    function getForecast(city) {
        //get 5 day forecast
        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + city + "&APPID=7e4c7478cc7ee1e11440bf55a8358ec3&units=imperial";
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            //add container div for forecast cards
            var newrow = $("<div>").attr("class", "forecast");
            $("#earthforecast").append(newrow);
    
            //loop through array response to find the forecasts for 15:00
            for (var i = 0; i < response.list.length; i++) {
                if (response.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                    var newCol = $("<div>").attr("class", "one-fifth");
                    newrow.append(newCol);
    
                    var newCard = $("<div>").attr("class", "card text-white bg-primary");
                    newCol.append(newCard);
    
                    var cardHead = $("<div>").attr("class", "card-header").text(moment(response.list[i].dt, "X").format("MMM Do"));
                    newCard.append(cardHead);
    
                    var cardImg = $("<img>").attr("class", "card-img-top").attr("src", "https://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png");
                    newCard.append(cardImg);
    
                    var bodyDiv = $("<div>").attr("class", "card-body");
                    newCard.append(bodyDiv);
    
                    bodyDiv.append($("<p>").attr("class", "card-text").html("Temp: " + response.list[i].main.temp + " &#8457;"));
                    bodyDiv.append($("<p>").attr("class", "card-text").text("Humidity: " + response.list[i].main.humidity + "%"));
                }
            }
        });
    }
    

    $('#searchBtn').on('click', function (e) {
        e.preventDefault();
        $('#foreCast').empty();
        getResults();
    })



    function displayDashbord() {
        $('#foreCast').empty();
        $('#showCity').text(city);
        dateEl.text('(' + formatted_date + ')');
        $('#image').attr('src', icon);
        $('#temperature').text(temparature + String.fromCharCode(176) + ' F');
        $('#humidity').text(humidity + '%');
        $('#wind').text(wind + ' MPH');
        $('#index').text(index);
        display5dayforecast();
    }

    $(document).on('click', 'li', function (e) {
        e.preventDefault();
        var searchedCity = $(this).text();
        getResults(searchedCity);
    })

    $('#clear').on('click', function(){
        localStorage.clear();
        location.reload();
    })

    displaylist();
    getResults(searchedArr[searchedArr.length -1])
    }
}

})
