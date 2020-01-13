const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const Attraction = db.Attraction
const Restaurant = db.Restaurant
const Shop = db.Shop
const User = db.User
const Component = db.Component
const Tour = db.Tour
const Comment = db.Comment



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
	getProfile: (req, res) => {
		console.log('req.user', req.user)
		return User.findByPk(req.user.id, {
			include: [
				{ model: Restaurant, as: 'FavoritedRestaurants' },
				{ model: Attraction, as: 'FavoritedAttractions' },
				{ model: Shop, as: 'FavoritedShops' },
				Tour,
				Comment
			]
		}).then(user => {
			FavoriteCount = user.FavoritedRestaurants.length + user.FavoritedAttractions.length + user.FavoritedShops.length
			console.log('user', user)
			return res.render('profile2', { profile: user, FavoriteCount})
		})
	},
  postTour: async (req, res) => {
		console.log('////////////////post tour/////////')
		tourComponents = []
		googleMapsClient = require('@google/maps').createClient({
			key: process.env.API_KEY,
			Promise: Promise
		})
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
			destination = tourComponents[tourComponents.length - 1].destination,
				endLocation = tourComponents[tourComponents.length - 1].destination,
				endDuration = tourComponents[tourComponents.length - 1].duration,
				endTime = tourComponents[tourComponents.length - 1].end

			return Tour.create({
				title: req.body.title,
				UserId: req.user.id,
				temp: false,
				origin: req.body.origin,
				destination: destination,
				endDuration: endDuration,
				endLocation: endLocation,
				endTime: endTime,
				date: req.body.date,
				startHourInit: req.body.startHourInit,
				startMinInit: req.body.startMinInit,
				days: "1",
				tourComponents: tourComponents
			}).then(tour => {
				//console.log('tour.tourComponents', tour.tourComponents)
				return res.redirect(`/users/${req.user.id}/tour/${tour.id}`)
			})
		} catch (err) { console.log(err) }

	},
  getUserDailyTour: (req, res) => {
		return Tour.findOne({
			where: {
				UserId: req.user.id,
				id: req.params.tour_id
			}
		}).then(tour => {
			console.log('tour.tourComponents', tour.tourComponents)
			//tour.tourComponents.pop()
			return res.render('getUserDailyTour', {
				API_KEY: process.env.API_KEY,
				title: tour.title,
				origin: tour.origin,
				destination: tour.destination,
				endDuration: tour.endDuration,
				endLocation: tour.endLocation,
				endTime: tour.endTime,
				date: tour.date,
				startHourInit: tour.startHourInit,
				startMinInit: tour.startMinInit,
				tourComponents: tour.tourComponents,
				id: tour.id
			})
		})
	},
	getUserDailyTourEdit: async(req, res) => {
		console.log('///////////get User Daily Tour Edit /////////////')
		return Tour.findOne({
			where: {
				UserId: req.user.id,
				id: req.params.tour_id
			}
		}).then(tour => {
			console.log('tour.tourComponents205', tour.tourComponents)
			tour.tourComponents.pop()
			return res.render('getUserDailyTourEdit', {
				API_KEY: process.env.API_KEY,
				title: tour.title,
				origin: tour.origin,
				destination: tour.destination,
				endDuration: tour.endDuration,
				endLocation: tour.endLocation,
				endTime: tour.endTime,
				date: tour.date,
				startHourInit: tour.startHourInit,
				startMinInit: tour.startMinInit,
				tourComponents: tour.tourComponents,
				id: tour.id
			})
		})
},
  putUserDailyTourEdit: async(req, res) => {
		console.log('///////////put user daily tour /////////////')

		googleMapsClient = require('@google/maps').createClient({
			key: process.env.API_KEY,
			Promise: Promise
		})
		tourComponents = []

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
					startMinInit: tour.startMinInit
				}
			})
			origin = req.body.origin || componentArray.origin
			startHourInit = parseInt(req.body.startHourInit)|| componentArray.startHourInit
			startMinInit = parseInt(req.body.startMinInit) || componentArray.startMinInit
			data = componentArray.data.map(d => d.destination)
			dataId = componentArray.data.map(d => d.id)
			dataImage = componentArray.data.map(d => d.image)
			dataStayTime = componentArray.data.map(d => d.stayTime)
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
				tourComponents.pop()
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


	},
  deleteUserDailyTour: (req, res) => {
	return Tour.findByPk(req.params.tour_id)
		.then(tour => {
			//console.log('tour', tour)
			tour.destroy()
			return res.redirect(`/users/${user.id}`)
		})
  },
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
		console.log('///////////hello reomve rest component////////')
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
		console.log('req.params.shop_id', req.params.shop_id)
		return Component.findOne({
			where: {
				UserId: req.user.id,
				ShopId: req.params.shop_id
			}
		}).then((component) => {
			console.log('component', component)
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
