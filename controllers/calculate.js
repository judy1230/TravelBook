const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
const Attraction = db.Attraction
const Shop = db.Shop
const Component = db.Component
const Tour = db.Tour
let navigator = require('web-midi-api')
const helpersreq = require('../_helpers')
let googleMapsClient = require('@google/maps').createClient({
	key: process.env.API_KEY,
	Promise: Promise
})


const calculate = {
	calculateDisplay: async (req, res, next) => {
	  try {
			let data = []
			let tourComponents = []
			//+8 is for heroku is utc time
			startMinInit = req.body.startMinInit ? parseInt(req.body.startMinInit) : new Date().getMinutes()
			startHourInit = req.body.startHourInit ? parseInt(req.body.startHourInit) : new Date().getHours() + 8
			date = req.body.date || `${new Date().getMonth() + 1} /  ${new Date().getDate()} / ${new Date().getFullYear()}`
			origin = req.body.origin || origin
			componentArray = await Component.findAll({
				where: {
					UserId: req.user.id
				},
				include: [
					Restaurant,
					Attraction,
					Shop
				],
				order: [
					['id', 'ASC']
				],
			}).then(components => {
				data = components.map(d => d.Restaurant ? d.Restaurant.dataValues : d.Attraction ? d.Attraction.dataValues : d.Shop.dataValues)
				return {
					data: data.map(r => ({
						name: r.name,
						image: r.image,
						id: r.id,
						category: r.category
					})),
					stayTime: components.map(r => r.stayTime)
				}
			})
			data = componentArray.data.map(d => d.name)
			dataId = componentArray.data.map(d => d.id)
			dataImage = componentArray.data.map(d => d.image)
			dataStayTime = componentArray.stayTime.map(d => d ? d : 90)
			dataCategory = componentArray.data.map(d => d.category)
			data.splice(0, 0, origin)
			data.push(origin)


			for (let i = 0; i < data.length - 1; i++) {
				let location1 = data[i]
				let location2 = data[i + 1]
				let diff = 0
				let diffLeave = 0
				if (location1 != data[0]) {
					startMin = leaveMin
					startHour = leaveHour
				} else {
					startMin = startMinInit
					startHour = startHourInit
				}
				duration = await googleMapsClient.directions({
					origin: location1,
					destination: location2
				}).asPromise()
					.then((response) => {
						return response.json.routes[0].legs[0].duration
					})
					.catch((err) => {
						console.log(err);
					})
				endMin = Math.floor(startMin + (duration.value / 60))
				leaveMin = endMin + dataStayTime[i]

				if (endMin >= 60) {
					diff = Math.floor(endMin / 60)
					endMin %= 60
				}
				if (leaveMin >= 60) {
					diffLeave = parseInt(leaveMin / 60)
					leaveMin %= 60
				}
				endHour = startHour + diff > 24 ? startHour + diff - 24 : startHour + diff
				leaveHour = startHour + diffLeave > 24 ? startHour + diffLeave - 24 : startHour + diffLeave
				image = dataImage[i]
				tourComponents.push({
					origin: location1,
					destination: location2,
					id: dataId[i],
					duration: duration.text,
					category: dataCategory[i],
					end: `${endHour}: ${endMin}`,
					leaveEnd: `${leaveHour}: ${leaveMin}`,
					stayTime: dataStayTime[i],
					image: image
				})
			}
			destination = tourComponents[tourComponents.length - 1].origin
			endLocation = tourComponents[tourComponents.length - 1].destination,
			endDuration = tourComponents[tourComponents.length - 1].duration,
			endTime = tourComponents[tourComponents.length - 1].end
			tourComponents.pop()

			return res.render('dailyTour', {
				API_KEY: process.env.API_KEY,
				title: req.body.title || "儲存前請輸入title",
				origin,
				destination,
				endLocation: origin,
				endDuration,
				endTime,
				tourComponents,
				date,
				startMinInit,
				startHourInit,
				typeofOrigin: typeof(origin)
			})
		} catch (err) { console.log(err) }
	},
	putTour: async (req, res) => {
		googleMapsClient = require('@google/maps').createClient({
			key: process.env.API_KEY,
			Promise: Promise
		})
		try {
			componentArray = await Tour.findOne({
				where: {
					UserId: req.user.id,
					id: req.params.tour_id
				}
			}).then(tour => {
				return {
					data: tour.tourComponents,
					origin: tour.origin,
					startHourInit: tour.startHourInit,
					startMinInit: tour.startMinInit,
					stayTime: tour.tourComponents.map(r => r.stayTime)
				}
			})
			startHourInit = parseInt(req.body.startHourInit) || componentArray.startHourInit
			startMinInit = parseInt(req.body.startMinInit) || componentArray.startMinInit
			data = componentArray.data.map(d => d.destination)
			dataId = componentArray.data.map(d => d.id)
			dataImage = componentArray.data.map(d => d.image)
			dataStayTime = componentArray.stayTime.map(d => d)
			dataCategory = componentArray.data.map(d => d.category)
			data.splice(0, 0, origin)
			for (let i = 0; i < data.length - 1; i++) {
				let location1 = data[i]
				let location2 = data[i + 1]
				if (location1 != data[0]) {
					startMin = leaveMin
					startHour = leaveHour
				} else {
					startMin = startMinInit
					startHour = startHourInit
				}
				duration = await googleMapsClient.directions({
					origin: location1,
					destination: location2
				}).asPromise()
					.then((response) => {
						return response.json.routes[0].legs[0].duration
					})
					.catch((err) => {
						console.log(err);
					})
				endMin = Math.floor(startMin + (duration.value / 60))
				leaveMin = endMin + dataStayTime[i]
				let diff = 0
				if (endMin > 60) {
					diff = Math.floor(endMin / 60)
					endMin %= 60
				}
				if (leaveMin > 60) {
					diffLeave = parseInt(leaveMin / 60)
					leaveMin %= 60
				}
				endHour = startHour + diff > 24 ? startHour + diff - 24 : startHour + diff
				leaveHour = startHour + diffLeave > 24 ? startHour + diffLeave - 24 : startHour + diffLeave
				image = dataImage[i]
				tourComponents.push({
					origin: location1,
					destination: location2,
					id: dataId[i],
					duration: duration.text,
					category: dataCategory[i],
					end: `${endHour}: ${endMin}`,
					leaveEnd: `${leaveHour}: ${leaveMin}`,
					stayTime: dataStayTime[i],
					image: image
				})
			}

			destination = tourComponents[tourComponents.length - 1].destination,
				endLocation = tourComponents[tourComponents.length - 1].destination,
				endDuration = tourComponents[tourComponents.length - 1].duration,
				endTime = tourComponents[tourComponents.length - 1].end
			return Tour.findOne({
				where: {
					UserId: req.user.id,
					id: req.params.tour_id
				}
			}).then(tour => {

				tour.update({
					title: req.body.title,
					origin: req.body.origin,
					date: req.body.date,
					startHourInit: parseInt(req.body.startHourInit),
					startMinInit: parseInt(req.body.startMinInit),
					tourComponents: tourComponents,
				})

				return res.redirect(`/users/${req.user.id}/tour/${tour.id}`)
			})
		} catch (err) { console.log(err) }
	}
}
module.exports = calculate

