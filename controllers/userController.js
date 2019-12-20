const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const Attraction = db.Attraction
const Restaurant = db.Restaurant
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
		res.redirect('/tweets')
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
		or
		return res.redirect('/users/:tour_id/daystour')
	},
	postBlog: (req, res) => {
		return res.redirect('/tours/blog/:tour_id')
	},

	getDailyTour: async (req, res) => {
		try {
			data =[]
			componentArray = await User.findByPk('2', {
					include: [
						{ model: Restaurant, as: 'ComponentRestaurants' },
						{ model: Attraction, as: 'ComponentAttractions' },
					]
				}).then(user => {
					data.push(...user.ComponentRestaurants)
					data.push(...user.ComponentAttractions)
					data.sort((a, b) => b.createdAt - a.createdAt)
					return ({ data })
				})
			for (let j = 0; j < componentArray.data.length; j++) {

				 data.push(componentArray.data[j].name)
				//console.log('data', data)
			}
			console.log('data', data)
			for (let i = 0; i < data.length; i++) {
				let Location1 = data[i]
				let Location2 = data[i+1]
				date = `${new Date().getMonth() + 1} /  ${new Date().getDate()}`
				startMin = new Date().getMinutes()
				startHour = new Date().getHours()
				const googleMapsClient = require('@google/maps').createClient({
					key: process.env.API_KEY,
					Promise: Promise
				})
				googleMapsClient.directions({
					origin: Location1,//{ lat: 25.033976, lng: 121.5645389 },
					destination: Location2//{ lat: 25.0478142, lng: 121.5169488 }
				}).asPromise()
					.then((response) => {
						duration = response.json.routes[0].legs[0].duration
						distance = response.json.routes[0].legs[0].distance
						console.log('duration', duration.text)
						endMin = Math.floor(startMin + (duration.value / 60))
						console.log('endMin', endMin)
						let diff = 0
						if (endMin > 60) {
							endMin = endMin - 60
							diff = 1
						}
						endHour = startHour + diff
						console.log('endMin', endMin)
						console.log('endHour', endHour)
						res.render('dailyTour', { date, Location1, Location2, duration: duration.text, distance: distance.text, endMin, endHour, startHour, startMin })
					})
					.catch((err) => {
						console.log(err);
					})

			}


		} catch (err) { console.log(err) }



	},
	getDaysTour: (req, res) => {
		return res.render('daysTour')
	},
	getBlog: (req, res) => {
		return res.render('blog')
	},
	getFavorite: async(req, res) => {
		try {
			let favoriteArray = []
			favoriteArray = await User.findByPk('2', {
				include: [
					{ model: Restaurant, as: 'FavoritedRestaurants' },
					{ model: Attraction, as: 'FavoritedAttractions' },
					{ model: Restaurant, as: 'ComponentRestaurants' },
				  { model: Attraction, as: 'ComponentAttractions' },
				]
			}).then(user => {
				const Restaurants = user.FavoritedRestaurants.map(r => ({
					...r.dataValues,
					isSelected: user.ComponentRestaurants.map(d => d.id).includes(r.id) ? true : false
				}))
				const Attractions = user.FavoritedAttractions.map(r => ({
					...r.dataValues,
					isSelected: user.ComponentAttractions.map(d => d.id).includes(r.id) ? true : false
				}))
				return { Restaurants , Attractions}
			})
			//console.log('favoriteArray.Attractions', favoriteArray.Attractions)
			return res.render('favorite', {
				attractions: favoriteArray.Attractions,
				restaurants: favoriteArray.Restaurants,
			})
		} catch (err) { console.log(err) }

	},
	addRestComponent: (req, res) => {
		return Component.create({
			UserId: '2',//req.user.id
			RestaurantId: req.params.rest_id,
		}).then((component) => {
				return res.redirect('back')
			})
	},
	removeRestComponent: (req, res) => {
		return Component.findOne({
			where: {
				UserId: '2',//req.user.id
				RestaurantId: req.params.rest_id
			}
		}).then((component) => {
			component.destroy()
			return res.redirect('back')
		})

	},
	addAttractionComponent: (req, res) => {
		return Component.create({
			UserId: '2',//req.user.id
			AttractionId: req.params.attraction_id,
		}).then((component) => {
				return res.redirect('back')
			})
	},
	removeAttractionComponent: (req, res) => {
		return Component.findOne({
			where: {
				UserId: '2',//req.user.id
				AttractionId: req.params.attraction_id
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
