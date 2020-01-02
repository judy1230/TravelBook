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
	tourEdit: (req, res) => {
		return res.render('tourEdit')
	},
	postTour: (req, res) => {
		return res.redirect('/users/:tour_id/dailytour')
	},
	postBlog: (req, res) => {
		return res.redirect('/tours/blog/:tour_id')
	},

	getDailyTour: async (req, res) => {
		try {
			data = []
			dataInit = '台北火車站'
			googleMapsClient = require('@google/maps').createClient({
				key: process.env.API_KEY,
				Promise: Promise
			})
			componentArray = await User.findByPk(req.user.id, {
				include: [
					{ model: Restaurant, as: 'ComponentRestaurants' },
					{ model: Attraction, as: 'ComponentAttractions' },
					{ model: Shop, as: 'ComponentShops' },
				]
			}).then(user => {
				data.push(...user.ComponentRestaurants)
				data.push(...user.ComponentAttractions)
				data.push(...user.ComponentShops)
				data.sort((a, b) => b.createdAt - a.createdAt)
				return ({ data })
			})
			data = componentArray.data.map(d => d.name)
			dataId = componentArray.data.map(d => d.id)
			dataImage = componentArray.data.map(d => d.image)
			dataStayTime = componentArray.data.map(d => d.stayTime)
			dataCategory = componentArray.data.map(d =>d.category)
			data.splice(0, 0, dataInit)

			date = `${new Date().getMonth() + 1} /  ${new Date().getDate()}`
			array1 = []
			startMinInit = new Date().getMinutes()
			startHourInit = new Date().getHours()

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
				array1.push({
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
			//console.log('array1', array1)
			return res.render('dailyTour', {
				API_KEY: process.env.API_KEY,
				origin: data[0],
				destination: data[data.length - 1],
				array1,
				date,
				startMinInit,
				startHourInit
			})
		} catch (err) { console.log(err) }
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
				isSelected: user.ComponentRestaurants.map(d => d.id).includes(r.id) ? true : false,
			}))

			locations = Restaurants.map(d => d.name)
			for (i = 0; i < locations.length; i++) {
				duration = await googleMapsClient.directions({
					origin: '台北火車站',
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
				isSelected: user.ComponentAttractions.map(d => d.id).includes(r.id) ? true : false,
				opening_hours: r.opening_hours.substring(0, 20)
			}))
			locations = Attractions.map(d => d.name)
			for (i = 0; i < locations.length; i++) {
				duration = await googleMapsClient.directions({
					origin: '台北火車站',
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
				isSelected: user.ComponentShops.map(d => d.id).includes(r.id) ? true : false,
				opening_hours: r.opening_hours.substring(0, 20)
			}))
			locations = Shops.map(d => d.name)
			for (i = 0; i < locations.length; i++) {
				duration = await googleMapsClient.directions({
					origin: '台北火車站',
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
			return res.render('favorite', {
				attractions: Attractions,
				restaurants: Restaurants,
				shops: Shops,

			})
		} catch (err) { console.log(err) }

	},
	addRestComponent: (req, res) => {
		return Component.create({
			UserId: req.user.id,
			RestaurantId: req.params.rest_id,
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
