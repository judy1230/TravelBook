const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const Attraction = db.Attraction
const Restaurant = db.Restaurant
const Shop = db.Shop
const User = db.User
const Component = db.Component
const Tour = db.Tour
const Blog = db.Blog
const Favorite = db.Favorite
const Like = db.Like
const Comment = db.Comment
const Location = db.Location
const helpersreq = require('../_helpers')


let userController = {
	signUpPage: (req, res) => {
		return res.render('signup')
	},
	signUp: (req, res) => {
		//confirm password
		if (req.body.passwordCheck !== req.body.password) {
			req.flash('error_msg', '兩次密碼輸入不同!')
			return res.redirect('/signup')
		} else {
			//confirm unique user
			User.findOne({ where: { email: req.body.email } }).then(user => {
				if (user) {
					req.flash('error_msg', '信箱重複')
					return res.redirect('/signup')
				} else {
					User.create({
						name: req.body.name,
						email: req.body.email,
						password: bcrypt.hashSync(req.body.password,
							bcrypt.genSaltSync(10), null)
					}).then(user => {
						req.flash('success_msg', '成功註冊帳號!')
						return res.redirect('/signin')
					})
				}
			})
		}
	},
	signInPage: (req, res) => {
		return res.render('signin')
	},
	signIn: (req, res) => {
		req.flash('success_msg', '成功登入!')
		res.redirect('/restaurants')
	},
	logout: (req, res) => {
		req.flash('success_msg', '成功登出!')
		req.logout()
		res.redirect('/signin')
	},
	tourEdit: async (req, res) => {
		console.log('///////////////////hello editTour///////////')
		try {
			data = []
			title = req.body.title
			origin = req.body.origin
			date = req.body.date
			startHourInit = parseInt(req.body.startHourInit)
			startMinInit = parseInt(req.body.startMinInit)
			stayTime = parseInt(req.body.stayTime)
			tourComponents = []
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
				return { data: data, stayTime: components.map(r => r.stayTime) }
			})

			data = componentArray.data.map(d => d.name)
			dataId = componentArray.data.map(d => d.id)
			dataImage = componentArray.data.map(d => d.image)
			dataStayTime = componentArray.data.map(d => d.stayTime)
			dataCategory = componentArray.data.map(d => d.category)
			data.splice(0, 0, origin)
			data.push(origin)
			//console.log('data',data)
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
			destination = tourComponents[tourComponents.length - 1],
				endLocation = tourComponents[tourComponents.length - 1].destination,
				endDuration = tourComponents[tourComponents.length - 1].duration,
				endTime = tourComponents[tourComponents.length - 1].end
			tourComponents.pop()
			return res.render('tourEdit', {
				API_KEY: process.env.API_KEY,
				origin:
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
	postUserTour: async (req, res) => {
		console.log('////////////////post tour/////////')
		try {
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
				return data.map(r => ({
					name: r.name,
					image: r.image,
					id: r.id,
					stayTime: r.stayTime ? r.stayTime : 90,
					category: r.category
				}))
			})
			return Tour.create({
				title:req.body.title,
				UserId: req.user.id,
				temp: false,
				origin: req.body.origin,
				date: req.body.date,
				startHourInit: req.body.startHourInit,
				startMinInit: req.body.startMinInit,
				days: "1",
				tourComponents: componentArray
			}).then(tour => {
				//console.log('tour.tourComponents', tour.tourComponents)
				return res.redirect('back')
			})
		} catch (err) { console.log(err) }



	},
	// getUserTour: async (req, res, next) => {
	// 	console.log('///////////////////get getUserTour///////////')
	// 	//data = []
	// 	try {
	// 		origin = res.locals.origin
	// 		componentArray = await Component.findAll({
	// 			where: {
	// 				UserId: req.user.id
	// 			},
	// 			include: [
	// 				Restaurant,
	// 				Attraction,
	// 				Shop
	// 			],
	// 			order: [
	// 				['id', 'ASC']
	// 			],
	// 		}).then(components => {
	// 			data = components.map(d => d.Restaurant ? d.Restaurant.dataValues : d.Attraction ? d.Attraction.dataValues : d.Shop.dataValues)
	// 			let result
	// 			return data.map(r => ({
	// 				name: r.name,
	// 				image: r.image,
	// 				id: r.id,
	// 				stayTime: r.stayTime ? r.stayTime : 90,
	// 				category: r.category
	// 			}))
	// 		})
	// 		console.log('componentArray', componentArray)
	// 		date = `${new Date().getMonth() + 1} /  ${new Date().getDate()} / ${new Date().getFullYear()}`
	// 		// tourComponents = []
	// 		startMinInit = new Date().getMinutes()
	// 		startHourInit = new Date().getHours()


	// 		// Tour.create({
	// 		// 	UserId: req.user.id,
	// 		// 	temp: true,
	// 		// 	origin: origin,
	// 		// 	date: date,
	// 		// 	startHourInit: startHourInit,
	// 		// 	startMinInit: startMinInit,
	// 		// 	days: "1",
	// 		// 	tourComponents: componentArray
	// 		// }).then(tour => {
	// 		// 	console.log('tour.tourComponents', tour.tourComponents)
	// 		// 	return next()
	// 		// })
	// 	} catch (err) { console.log(err) }
	// },



	// putTour: async(req, res) => {
	// 	console.log('///////////////////hello putTour///////////')
	// 	try {
	// 		data = []
	// 		title = req.body.title
	// 		origin = req.body.origin
	// 		date = req.body.date
	// 		startHourInit = parseInt(req.body.startHourInit)
	// 		startMinInit = parseInt(req.body.startMinInit)
	// 		stayTime = parseInt(req.body.stayTime)
	// 		tourComponents = []
	// 		googleMapsClient = require('@google/maps').createClient({
	// 			key: process.env.API_KEY,
	// 			Promise: Promise
	// 		})
	// 		componentArray = await Component.findAll({
	// 			where: {
	// 				UserId: req.user.id
	// 			},
	// 			include: [
	// 				Restaurant,
	// 				Attraction,
	// 				Shop
	// 			],
	// 			order: [
	// 				['id', 'ASC']
	// 			],
	// 		}).then(components => {
	// 			data = components.map(d => d.Restaurant ? d.Restaurant.dataValues : d.Attraction ? d.Attraction.dataValues : d.Shop.dataValues)
	// 			return { data: data, stayTime: components.map(r => r.stayTime) }
	// 		})

	// 		data = componentArray.data.map(d => d.name)
	// 		dataId = componentArray.data.map(d => d.id)
	// 		dataImage = componentArray.data.map(d => d.image)
	// 		dataStayTime = componentArray.data.map(d => d.stayTime)
	// 		dataCategory = componentArray.data.map(d => d.category)
	// 		data.splice(0, 0, origin)
	// 		data.push(origin)
	//     //console.log('data',data)
	// 		for (let i = 0; i < data.length - 1; i++) {
	// 			let location1 = data[i]
	// 			let location2 = data[i + 1]
	// 			if (location1 != data[0]) {
	// 				startMin = leaveMin
	// 				startHour = leaveHour
	// 			} else {
	// 				startMin = startMinInit
	// 				startHour = startHourInit
	// 			}
	// 			duration = await googleMapsClient.directions({
	// 				origin: location1,
	// 				destination: location2
	// 			}).asPromise()
	// 				.then((response) => {
	// 					return response.json.routes[0].legs[0].duration
	// 				})
	// 				.catch((err) => {
	// 					console.log(err);
	// 				})
	// 			endMin = Math.floor(startMin + (duration.value / 60))
	// 			leaveMin = endMin + dataStayTime[i]
	// 			let diff = 0
	// 			if (endMin > 60) {
	// 				diff = Math.floor(endMin / 60)
	// 				endMin %= 60
	// 			}
	// 			if (leaveMin > 60) {
	// 				diffLeave = parseInt(leaveMin / 60)
	// 				leaveMin %= 60
	// 			}
	// 			endHour = startHour + diff
	// 			leaveHour = startHour + diffLeave
	// 			image = dataImage[i]
	// 			tourComponents.push({
	// 				origin:location1,
	// 				destination: location2,
	// 				id: dataId[i],
	// 				duration: duration.text,
	// 				category: dataCategory[i],
	// 				end: `${endHour}: ${endMin}`,
	// 				leaveEnd: `${leaveHour}: ${leaveMin}`,
	// 				stayTime: dataStayTime[i],
	// 				image: image
	// 			})
	// 		}
	// 		destination = tourComponents[tourComponents.length - 1],
	// 			endLocation = tourComponents[tourComponents.length - 1].destination,
	// 			endDuration = tourComponents[tourComponents.length - 1].duration,
	// 			endTime = tourComponents[tourComponents.length - 1].end
	// 		tourComponents.pop()
	// 		console.log('tourComponents', tourComponents)
	// 		Tour.create({
	// 			title: req.body.title,
	// 			UserId: req.user.id,
	// 			origin: req.body.origin,
	// 			date: req.body.date,
	// 			startHourInit: req.body.startHourInit,
	// 			startMinInit: req.body.startMinInit,
	// 			stayTime: req.body.stayTime,
	// 			days: "1",
	// 			tourComponents: JSON.stringify(...tourComponents)
	// 		}).then(tour => {
	// 			console.log('tour',tour)
	// 			return res.render('dailyTour', {
	// 				API_KEY: process.env.API_KEY,
	// 				title,
	// 				origin,
	// 				destination,
	// 				endLocation,
	// 				endDuration,
	// 				endTime,
	// 				tourComponents,
	// 				date,
	// 				startMinInit,
	// 				startHourInit
	// 			})

	// 		})
	// 		return res.render('dailyTour', {
	// 			API_KEY: process.env.API_KEY,
	// 			title,
	// 			origin,
	// 			destination,
	// 			endLocation,
	// 			endDuration,
	// 			endTime,
	// 			tourComponents,
	// 			date,
	// 			startMinInit,
	// 			startHourInit
	// 		})
	// 	} catch (err) { console.log(err) }

	// },
	postRestComment: (req, res) => {
		return Comment.create({
			UserId: req.user.id,
			RestaurantId: req.params.rest_id,
			comment: req.body.comment
		}).then((comment) => {
			return res.redirect('back')
		})
	},
	removeRestComment: (req, res) => {
		return Comment.findByPk(req.params.comment_id).then((comment) => {
			comment.destroy()
			return res.redirect('back')
		})
	},
	postBlog: (req, res) => {
		return res.redirect('/tours/blog/:tour_id')
	},

	// getDailyTour: async (req, res) => {
	// 	try {
	// 		data = []
	// 		origin = res.locals.origin
	// 		googleMapsClient = require('@google/maps').createClient({
	// 			key: process.env.API_KEY,
	// 			Promise: Promise
	// 		})
	// 		componentArray = await Component.findAll({
	// 			where: {
	// 				UserId: req.user.id
	// 			},
	// 			include: [
	// 				Restaurant,
	// 				Attraction,
	// 				Shop
	// 			],
	// 			order: [
	// 				['id', 'ASC']
	// 			],
	// 		}).then(components => {
	// 			data = components.map(d => d.Restaurant ? d.Restaurant.dataValues : d.Attraction ? d.Attraction.dataValues : d.Shop.dataValues)
	// 			return { data: data, stayTime: components.map(r => r.stayTime) }
	// 		})

	// 		data = componentArray.data.map(d => d.name)
	// 		dataId = componentArray.data.map(d => d.id)
	// 		dataImage = componentArray.data.map(d => d.image)

	// 		dataStayTime = componentArray.stayTime.map(d => d ? d : 90)
	// 		//console.log('dataStayTime', dataStayTime)
	// 		dataCategory = componentArray.data.map(d => d.category)
	// 		data.splice(0, 0, origin)
	// 		data.push(origin)
	// 		date = `${new Date().getMonth() + 1} /  ${new Date().getDate()} / ${new Date().getFullYear()}`
	// 		tourComponents = []
	// 		startMinInit = new Date().getMinutes()
	// 		startHourInit = new Date().getHours()
	// 		for (let i = 0; i < data.length - 1; i++) {
	// 			let location1 = data[i]
	// 			let location2 = data[i + 1]
	// 			let diff = 0
	// 			let diffLeave = 0
	// 			if (location1 != data[0]) {
	// 				startMin = leaveMin
	// 				startHour = leaveHour
	// 			} else {
	// 				startMin = startMinInit
	// 				startHour = startHourInit
	// 			}
	// 			duration = await googleMapsClient.directions({
	// 				origin: location1,
	// 				destination: location2
	// 			}).asPromise()
	// 				.then((response) => {
	// 					return response.json.routes[0].legs[0].duration
	// 				})
	// 				.catch((err) => {
	// 					console.log(err);
	// 				})
	// 			endMin = Math.floor(startMin + (duration.value / 60))
	// 			leaveMin = endMin + dataStayTime[i]

	// 			if (endMin > 60) {
	// 				diff = Math.floor(endMin / 60)
	// 				endMin %= 60
	// 			}
	// 			if (leaveMin > 60) {
	// 				diffLeave = parseInt(leaveMin / 60)
	// 				leaveMin %= 60
	// 			}
	// 			endHour = startHour + diff
	// 			leaveHour = startHour + diffLeave
	// 			image = dataImage[i]
	// 			tourComponents.push({
	// 				origin: location1,
	// 				destination: location2,
	// 				id: dataId[i],
	// 				duration: duration.text,
	// 				category: dataCategory[i],
	// 				end: `${endHour}: ${endMin}`,
	// 				leaveEnd: `${leaveHour}: ${leaveMin}`,
	// 				stayTime: dataStayTime[i],
	// 				image: image
	// 			})
	// 		}

	// 		destination = tourComponents[tourComponents.length - 1],
	// 			endLocation = tourComponents[tourComponents.length - 1].destination,
	// 			endDuration = tourComponents[tourComponents.length - 1].duration,
	// 			endTime = tourComponents[tourComponents.length - 1].end
	// 		tourComponents.pop()

	// 		console.log('tourComponents578', ...tourComponents)
	// 		return res.render('dailyTour', {
	// 			API_KEY: process.env.API_KEY,
	// 			origin,
	// 			destination,
	// 			endLocation,
	// 			endDuration,
	// 			endTime,
	// 			tourComponents,
	// 			date,
	// 			startMinInit,
	// 			startHourInit
	// 		})
	// 	} catch (err) { console.log(err) }
	// },
	getDaysTour: (req, res) => {
		return res.render('daysTour')
	},
	getBlog: (req, res) => {
		return res.render('blog')
	},
	getFavorites: async (req, res) => {
		try {
			googleMapsClient = require('@google/maps').createClient({
				key: process.env.API_KEY,
				Promise: Promise
			})
			let favoriteArray = []
			user = await User.findByPk(req.user.id, {
				include: [
					{ model: Restaurant, as: 'FavoritedRestaurants' },
					{ model: Attraction, as: 'FavoritedAttractions' },
					{ model: Shop, as: 'FavoritedShops' },
					{ model: Restaurant, as: 'ComponentRestaurants' },
					{ model: Attraction, as: 'ComponentAttractions' },
					{ model: Shop, as: 'ComponentShops' }
				]
			})
			const Restaurants = await user.FavoritedRestaurants.map(r => ({
				...r.dataValues,
				name: r.dataValues.name.substring(0, 7),
				isSelected: user.ComponentRestaurants.map(d => d.id).includes(r.id) ? true : false,
				introduction: r.dataValues.introduction.substring(0, 10),
				ratingStars: (Math.round((r.rating / 5) * 100)) + '%',
				opening_hours: r.opening_hours.substring(0, 10)
			}))

			locations = Restaurants.map(d => d.name)
			for (i = 0; i < locations.length; i++) {
				duration = await googleMapsClient.directions({
					origin: res.locals.origin,
					destination: locations[i]
				}).asPromise()
					.then((response) => {
						return response.json.routes[0].legs[0].duration.text
					})
					.catch((err) => {
						console.log(err);
					})
				//console.log('duration', duration)
				Restaurants[i].duration = duration
			}
			const Attractions = user.FavoritedAttractions.map(r => ({
				...r.dataValues,
				name: r.dataValues.name.substring(0, 7),
				isSelected: user.ComponentAttractions.map(d => d.id).includes(r.id) ? true : false,
				introduction: r.dataValues.introduction.substring(0, 10),
				ratingStars: (Math.round((r.rating / 5) * 100)) + '%',
				opening_hours: r.opening_hours.substring(0, 10)
			}))
			locations = Attractions.map(d => d.name)
			for (i = 0; i < locations.length; i++) {
				duration = await googleMapsClient.directions({
					origin: res.locals.origin,
					destination: locations[i]
				}).asPromise()
					.then((response) => {
						return response.json.routes[0].legs[0].duration.text
					})
					.catch((err) => {
						console.log(err);
					})
				Attractions[i].duration = duration
			}
			const Shops = user.FavoritedShops.map(r => ({
				...r.dataValues,
				name: r.dataValues.name.substring(0, 7),
				isSelected: user.ComponentShops.map(d => d.id).includes(r.id) ? true : false,
				introduction: r.dataValues.introduction.substring(0, 10),
				ratingStars: (Math.round((r.rating / 5) * 100)) + '%',
				opening_hours: r.opening_hours.substring(0, 10)
			}))
			locations = Shops.map(d => d.name)
			for (i = 0; i < locations.length; i++) {
				duration = await googleMapsClient.directions({
					origin: res.locals.origin,
					destination: locations[i]
				}).asPromise()
					.then((response) => {
						return response.json.routes[0].legs[0].duration.text
					})
					.catch((err) => {
						console.log(err);
					})
				Shops[i].duration = duration
			}
			favoriteArray.push(...Attractions)
			favoriteArray.push(...Restaurants)
			favoriteArray.push(...Shops)
			console.log('favoriteArray', favoriteArray)
			return res.render('favorite', {
				attractions: Attractions,
				restaurants: Restaurants,
				shops: Shops,
				favoriteArray: favoriteArray

			})
		} catch (err) { console.log(err) }

	},
	addRestComponent: (req, res) => {
		return Component.create({
			UserId: req.user.id,
			RestaurantId: req.params.rest_id
		}).then((component) => {
			return res.redirect('back')
		})
	},
	removeRestComponent: (req, res) => {
		return Component.findOne({
			where: {
				UserId: req.user.id,
				RestaurantId: req.params.rest_id
			}
		}).then((component) => {
			component.destroy()
			return res.redirect('back')
		})
	},
	putRestComponent: (req, res) => {
		console.log('///////////hello put rest////////')
		return Component.findOne({
			where: {
				UserId: req.user.id,
				RestaurantId: req.params.rest_id
			}
		}).then((component) => {
			console.log('component', component)
			component.update({
				stayTime: req.body.stayTime
			})
			return res.redirect('back')
		})
	},
	addAttractionComponent: (req, res) => {
		return Component.create({
			UserId: req.user.id,
			AttractionId: req.params.attraction_id,
		}).then((component) => {
			return res.redirect('back')
		})
	},
	removeAttractionComponent: (req, res) => {
		return Component.findOne({
			where: {
				UserId: req.user.id,
				AttractionId: req.params.attraction_id
			}
		}).then((component) => {
			component.destroy()
			return res.redirect('back')
		})

	},
	putAttractionComponent: (req, res) => {
		console.log('///////////hello put attraction////////')
		return Component.findOne({
			where: {
				UserId: req.user.id,
				AttractionId: req.params.attraction_id
			}
		}).then((component) => {
			console.log('component', component)
			component.update({
				stayTime: req.body.stayTime
			})
			return res.redirect('back')
		})
	},
	addShopComponent: (req, res) => {
		return Component.create({
			UserId: req.user.id,
			ShopId: req.params.shop_id,
		}).then((component) => {
			return res.redirect('back')
		})
	},
	removeShopComponent: (req, res) => {
		return Component.findOne({
			where: {
				UserId: req.user.id,
				ShopId: req.params.shop_id
			}
		}).then((component) => {
			component.destroy()
			return res.redirect('back')
		})

	},
	putShopComponent: (req, res) => {
		console.log('///////////hello put shop////////')
		return Component.findOne({
			where: {
				UserId: req.user.id,
				ShopId: req.params.shop_id
			}
		}).then((component) => {
			console.log('component', component)
			component.update({
				stayTime: req.body.stayTime
			})
			return res.redirect('back')
		})
	},
	getBlogEdit: (req, res) => {
		return res.render('blogEdit')
	},
	getShare: (req, res) => {
		return res.render('share')
	},
	postShare: (req, res) => {
		return res.redirect('back')
	}


}

module.exports = userController
