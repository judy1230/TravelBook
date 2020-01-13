const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
const Attraction = db.Attraction
const Shop = db.Shop
const Tour = db.Tour
const Component = db.Component
const Blog = db.Blog
const Favorite = db.Favorite
const Like = db.Like
const Comment = db.Comment
const Location = db.Location
let navigator = require('web-midi-api')
//const imgur = require('imgur-node-api')
//const IMGUR_CLIENT_ID = '158d5ec5eff6842'
//const fs = require('fs')
const helpersreq = require('../_helpers')


const calculate = {
	calculateDisplay: async (req, res) => {
		console.log('/////////////////// calculateDisplay ///////////')
		///geolocaion
	if ("geolocation" in navigator) {
				 /* geolocation is available */
				 console.log('geolocation is available')
	      navigator.geolocation.getCurrentPosition(function(position) {
				origin = position.coords.latitude, position.coords.longitude;
				console.log('origin_avaialbe', origin)
       });
      } else {
				 /* geolocation IS NOT available */
				 console.log('geolocation IS NOT available')
				 origin = '宜蘭火車站'
				 console.log('origin_Notavaialbe', origin)
      }

		try {
			let data = []
			let tourComponents = []
			startMinInit = parseInt(req.body.startMinInit) || new Date().getMinutes()
			startHourInit = parseInt(req.body.startHourInit) || new Date().getHours()
			date = req.body.date || `${new Date().getMonth() + 1} /  ${new Date().getDate()} / ${new Date().getFullYear()}`
      origin = req.body.origin || origin
			//origin = req.body.origin || res.locals.origin
			googleMapsClient = require('@google/maps').createClient({
				key: process.env.API_KEY,
				Promise: Promise
			})
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
						stayTime: r.stayTime,
						category: r.category
					})),
					stayTime: components.map(r => r.stayTime)
				}
			})

			data = componentArray.data.map(d => d.name)
			dataId = componentArray.data.map(d => d.id)
			dataImage = componentArray.data.map(d => d.image)
			dataStayTime = componentArray.stayTime.map(d => d ? d : 90)
			//console.log('dataStayTime', dataStayTime)
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

				if (endMin > 60) {
					diff = Math.floor(endMin / 60)
					endMin %= 60
				}
				if (leaveMin > 60) {
					diffLeave = parseInt(leaveMin / 60)
					leaveMin %= 60
				}
				endHour = startHour + diff
				leaveHour = startHour + diffLeave
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
			//console.log('tourComponents', tourComponents[0].id)
			//console.log('destination',destination)
			return res.render('dailyTour', {
				API_KEY: process.env.API_KEY,
				title: req.body.title || "儲存前請輸入title",
				origin,
				destination,
				endLocation,
				endDuration,
				endTime,
				tourComponents,
				date,
				startMinInit,
				startHourInit
			})
		} catch (err) { console.log(err) }
	},


}
module.exports = calculate

