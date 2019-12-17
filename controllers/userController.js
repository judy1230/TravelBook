const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const Attraction = db.Attraction
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

	getDailyTour: (req, res) => {
		startMin = new Date().getMinutes()
		startHour = new Date().getHours()
		console.log('startMins', startMin)
		console.log('startHours', startHour)
		const googleMapsClient = require('@google/maps').createClient({
			key: process.env.API_KEY,
			Promise: Promise
		})
		// googleMapsClient.geocode({
		// 	address:'台北火車站'
		//  }).asPromise()
		// 	 .then((response) => {
		// 		console.log(response.json.results);
		// 		center = response.json.results[0].geometry.location
		// 		 console.log("center", center)
		// 	})
		// 	.catch((err) => {
		// 		console.log(err);
		// 	})
		googleMapsClient.directions({
			origin: { lat: 25.033976, lng:121.5645389 },
			destination: { lat: 25.0478142, lng: 121.5169488 }
		}).asPromise()
			.then((response) => {
				duration = response.json.routes[0].legs[0].duration
				distance = response.json.routes[0].legs[0].distance
				console.log('duration', typeof(duration.text))
				endMin = Math.floor(startMin + (duration.value / 60))
				console.log('endMin', endMin)
				let diff = 0
				if (endMin > 60) {
					endMin = endMin - 60
					diff=1
				}
				endHour = startHour + diff
				console.log('endMin', endMin)
				console.log('endHour', endHour)
				// endHour = Math.floor(end/1000/60/60)
				// endMin = Math.floor(((end - endHour )* 1000 * 60 * 60)/1000/60)
				// console.log('hour', endHour)
				// console.log('min', endMin)

				//center = response.json.results[0].geometry.location
				//console.log("center", center)
				res.render('dailyTour', { duration: duration.text, distance: distance.text, endMin, endHour, startHour, startMin })
			})
			.catch((err) => {
				console.log(err);
			})



	},
	getDaysTour: (req, res) => {
		return res.render('daysTour')
	},
	getBlog: (req, res) => {
		return res.render('blog')
	},


	getComponent: (req, res) => {
		return res.render('Component')
	},
	postComponent: (req, res) => {
		return res.redirect('/users/:id/tourEdit')
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
