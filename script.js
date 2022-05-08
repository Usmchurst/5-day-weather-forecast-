let apiKey = "ab1c0d78c19197471fbb5348c3b1f2f1";

$(document).ready(function () {
	var citHis = loadFromStorage();

	drawHistory(citHis);

	function drawWeather(city, apiKey) {
		var date = moment().format("M/DD/YY");
		var queryURL = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=" + city + "&appid=" + apiKey;

		$.ajax({
			url: queryURL,
			method: "GET"
		})
			.then(function (weather) {
				var cityName = weather.name;
				var cityTemp = weather.main.temp;
				var cityHumi = weather.main.humidity;
				var cityWind = weather.wind.speed;

				var icon = "https://openweathermap.org/img/wn/" + weather.weather[0].icon + "@2x.png";
				var image = $("<img>").attr("src", icon).addClass('upimg');

				var lat = weather.coord.lat.toFixed(2);
				var lon = weather.coord.lon.toFixed(2);

				clearCityInfo();

				$("#name_c").append(cityName + " (" + date + ") ");
				$("#name_c").append(image);
				$("#temp_c").append(cityTemp + " \u00B0F");
				$("#humi_c").append(cityHumi + "%");
				$("#wind_c").append(cityWind + " MPH");

				var oneCallURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,daily,alerts&appid=" + apiKey;

				$.ajax({
					url: oneCallURL,
					method: "GET"
				})
					.then(function (onecall) {
						var cityUvi = onecall.current.uvi;
						$("#city-uvi").append(cityUvi);

						
					})
			})

		var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?&units=imperial&q=" + city + "&appid=" + apiKey;

		$.ajax({
			url: forecastURL,
			method: "GET"
		})
			.then(function (forecast) {
				for (var i = 3; i < 40; i += 8) {
					var newDate = forecast.list[i].dt_txt.split(" ", 1)
					newDate = newDate[0].split("-")
					newDate = newDate[1] + "/" + newDate[2] + "/" + newDate[0];

					var newForeCastItem = $("<div>").addClass("col");

					var newBlueCard = $("<div>").addClass("rounded blue-box");

					var newCardBody = $("<div>").addClass("card-body");

					var newcardTitle = $("<h5>").text(newDate);
					var newIcon = "https://openweathermap.org/img/wn/" + forecast.list[i].weather[0].icon + ".png";
					var newCardImage = $("<img>").attr("src", newIcon).attr("width", '60%');
					var newTemp = $("<p>").text("Temp: " + forecast.list[i].main.temp + " \u00B0F");
					var newWind = $("<p>").text("Wind: " + forecast.list[i].wind.speed + " MPH");

					var newHumi = $("<p>").text("Humidity: " + forecast.list[i].main.humidity + "%");

					newCardBody.append(newcardTitle).append(newCardImage).append(newTemp).append(newWind).append(newHumi);
					newBlueCard.append(newCardBody);
					newForeCastItem.append(newBlueCard);
					$("#forecast-area").append(newForeCastItem);
				}
			})
	}

	function savetoStorage(array) {
		if (array.length > 10) {
			array.pop();
		}
		localStorage.setItem("history", JSON.stringify(array));
		drawHistory(loadFromStorage());
	}

	function loadFromStorage() {
		if (localStorage.length === 0) {
		} else {
			citHis = JSON.parse(localStorage.getItem("history"));
			return citHis;
		}
	}

	function drawHistory(arr) {
		$(".list-group").empty();
		if (arr) {
			for (var i = 0; i < arr.length; i++) {
				var lstItmNew = $("<button>");
				lstItmNew.attr("type", "button");
				lstItmNew.attr("data-name", arr[i]);
				lstItmNew.addClass("history-btn");
				lstItmNew.text(arr[i]);
				$(".list-group").append(lstItmNew);
			}
		}
	}

	function clearCityInfo() {
		$("#city-name").empty();
		$("#city-temp").empty();
		$("#city-humi").empty();
		$("#city-wind").empty();
		$("#city-uvi").empty();
		$("#forecast-area").empty();
	}

	function removeUvClasses() {
		$("#city-uvi").removeClass("");
	}

	$("#search-city").on("click", function (event) {
		event.preventDefault();
		var city = $("input").eq(0).val();
		if (citHis) {
			citHis.unshift(city);
		} else {
			citHis = [city];
		}

		$("#field-input").val("");
		savetoStorage(citHis);
		drawWeather(city, apiKey);
	})

	$(".history-btn").on("click", function (event) {
		event.preventDefault();
		city = $(this).attr("data-name");
		drawWeather(city, apiKey);
	})

	$("#clear-search").on("click", function (event) {
		event.preventDefault();
		$(".list-group").empty();
		localStorage.clear();
		citHis = [];
	});
})