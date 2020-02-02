const axios = require('axios').default;

let lat;
let lon;

module.exports = {
	getWeather: (req, res, next) => {
		axios.get(`https://api.openweathermap.org/data/2.5/forecast?APPID=9c39fa3ce9d953fdd507d7d9f77093ef&units=metric&lat=${lat}&lon=${lon}`,true)
			.then(function (response) {
				// handle success
				//let city = response.data.city.name + ", " + response.data.city.country;
				let weather = response.data.list[0].weather[0].main
				let temp = response.data.list[0].main.temp + "°"
				req.weather = weather
				req.temp = temp
				next()

			})
			.catch(function (error) {
				// handle error
				console.log(error);
			})
			.then(function () {
				// always executed
			});
	},
	getCurrentPosition: (req, res, next) => {
		axios.post(`https://www.googleapis.com/geolocation/v1/geolocate?key=${process.env.API_KEY}`, {
		})
			.then(function (response) {
				//origin =  Object.values(response.data.location)
				//lat = response.data.location.lat.toString()
				//lon = response.data.location.lng.toString()
				origin = [24.7859287, 121.77640849999999]
				lat = 24.7859287
				lon = 121.77640849999999
				next()
			})
			.catch(function (error) {
				console.log(error);
			});

	}

}


