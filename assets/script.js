 
var apiKey = "086ebf3328b54ec0cdd32ced37bf1cdf"
var searchCity = document.getElementById("search-city")
var city = document.getElementById("city")
city.textContent = searchCity.value
function weather() {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + searchCity.value + "&appid=" + apiKey
     fetch(apiUrl)
    .then(function(response){

   return response.json() })
   .then(function(data){
       console.log(data)
   })
}
$('#button').on('click', weather);