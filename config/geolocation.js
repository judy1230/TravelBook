const axios = require('axios').default;

let lat;
let lon;

module.exports = {
	getWeather: (req, res, next) => {

		axios.get(`https://api.openweathermap.org/data/2.5/forecast?APPID=9c39fa3ce9d953fdd507d7d9f77093ef&units=metric&q=${name}`)
			.then(function (response) {
				// handle success
				//let city = response.data.city.name + ", " + response.data.city.country;
				let weatherTitle = response.data.list[0].weather[0].main;
				let temp = response.data.list[0].main.temp+ "°";
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
				origin = Object.values(response.data.location)
				lat = response.data.location.lat
				lon = response.data.location.lng
				next()
			})
			.catch(function (error) {
				console.log(error);
			});

	},
	geolocation: (req, res, next) => {
		
	}

}


