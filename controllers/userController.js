const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const Attraction = db.Attraction
const Restaurant = db.Restaurant
const Shop = db.Shop
const User = db.User
const Component = db.Component
const Tour = db.Tour
const Favorite = db.Favorite
const Comment = db.Comment
const currentTime = (new Date().getHours() +8)+ new Date().getMinutes() / 60
//const Blog = db.Blog
//const Like = db.Like
//const Location = db.Location
//const helpersreq = require('../_helpers')



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
	signIn: (req, res, next) => {
		req.flash('success_msg', '成功登入!')
		res.redirect('/index')
	},
	logout: (req, res) => {
		req.flash('success_msg', '成功登出!')
		req.logout()
		res.redirect('/signin')
	},
	getProfile: async (req, res) => {
		try { //console.log('req.user', req.user)
			user = await User.findByPk(req.user.id, {
				include: [
					{ model: Restaurant, as: 'FavoritedRestaurants' },
					{ model: Attraction, as: 'FavoritedAttractions' },
					{ model: Shop, as: 'FavoritedShops' },
					Tour
				]
			}).then(user => {
				return user
			})
			tours = await Tour.findAll({
				where: {
					UserId: req.user.id
				}
			}).then(tours => {
				return tours.map(d => ({
					id: d.id,
					title: d.title,
				  components: d.tourComponents
				}))
			})
			return res.render('profile', { profile: user, tours })
		} catch (err) { console.log(err) }

	},
	getDailyTour: (req, res) => {
		tourComponents = req.tourComponents
		temp = req.temp
		weather = req.weather
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
			typeofOrigin: typeof (origin) === typeof ("string") ? true : false,
			weather,
			temp
		})
	},
  postTour: async (req, res) => {
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
						category: r.category
					})),
					stayTime: components.map(r => r.stayTime)
				}
			})
			data = componentArray.data.map(d => d.name)
			dataId = componentArray.data.map(d => d.id)
			dataImage = componentArray.data.map(d => d.image)
			//這裡是指是否有修改過的StayTime若有舊照原來的,若沒有則預設90
			dataStayTime = componentArray.stayTime.map(d => d ? d : 90)
			dataCategory = componentArray.data.map(d => d.category)
			data.splice(0, 0, origin)
			data.push(origin)
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
			  destination = tourComponents[tourComponents.length - 1].origin,
				endDuration = tourComponents[tourComponents.length - 1].duration,
				endTime = tourComponents[tourComponents.length - 1].end
			tourComponents.pop()
			return Tour.create({
				title: req.body.title,
				UserId: req.user.id,
				temp: false,
				origin: req.body.origin === undefined ? '目前位置': req.body.origin,
				destination: destination,
				endDuration: endDuration,
				endLocation: req.body.origin === undefined ? '目前位置' : req.body.origin,
				endTime: endTime,
				date: req.body.date,
				startHourInit: req.body.startHourInit,
				startMinInit: req.body.startMinInit,
				days: "1",
				tourComponents: tourComponents
			}).then(tour => {
				req.flash('success_msg', '成功儲存Tour!')
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
			return res.render('getUserDailyTour', {
				API_KEY: process.env.API_KEY,
				title: tour.title,
				origin: tour.origin,
				originInMap: tour.origin === '目前位置' ? origin : tour.origin,
				destination: tour.destination,
				endDuration: tour.endDuration,
				endLocation: tour.endLocation,
				endTime: tour.endTime,
				date: tour.date,
				startHourInit: tour.startHourInit,
				startMinInit: tour.startMinInit,
				tourComponents: tour.tourComponents,
				id: tour.id,
				userId:req.user.id
			})
		})
	},
	getUserDailyTourEdit: async(req, res) => {
		return Tour.findOne({
			where: {
				UserId: req.user.id,
				id: req.params.tour_id
			}
		}).then(tour => {

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
	putUserDailyTourEdit: async (req, res, next) => {
		tourComponents = []
		origin = req.body.origin
		return next()
	},
	deleteUserDailyTour: (req, res) => {
		req.flash('warning_msg', '確定刪除Tour?')
		return Tour.findByPk(req.params.tour_id)
		.then(tour => {
			//console.log('tour', tour)
			tour.destroy()
			return res.redirect(`/users/${req.user.id}/profile`)
		})
  },
	postRestComment: (req, res) => {
		return Comment.create({
			UserId: req.user.id,
			RestaurantId: req.params.rest_id,
			comment: req.body.comment
		}).then((comment) => {
			req.flash('success_msg', '留言成功!')
			return res.redirect('back')
		})
	},
	removeComment: (req, res) => {
		return Comment.findByPk(req.params.comment_id).then((comment) => {
			comment.destroy()
			return res.redirect('back')
		})
	},
	postAttractionComment: (req, res) => {
		return Comment.create({
			UserId: req.user.id,
			AttractionId: req.params.attraction_id,
			comment: req.body.comment
		}).then((comment) => {
			req.flash('success_msg', '留言成功!')
			return res.redirect('back')
		})
	},
	postShopComment: (req, res) => {
		return Comment.create({
			UserId: req.user.id,
			ShopId: req.params.shop_id,
			comment: req.body.comment
		}).then((comment) => {
			req.flash('success_msg', '留言成功!')
			return res.redirect('back')
		})
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
				opening_hours: r.opening_hours.substring(0, 10),
				status: currentTime > JSON.parse("[" + r.dataValues.opening_up + "]") && currentTime <
					JSON.parse("[" + r.dataValues.opening_down + "]") ? '營業中' :
					Math.abs(JSON.parse("[" + r.dataValues.opening_up + "]") - currentTime) < 0.5 && (JSON.parse("[" + r.dataValues.opening_up + "]") - currentTime) > 0 ? '即將營業' :
						Math.abs(JSON.parse("[" + r.dataValues.opening_down + "]") - currentTime) < 1 && (JSON.parse("[" + r.dataValues.opening_down + "]") - currentTime) > 0 ? '即將結束營業' :
							'休息中'
			}))

			locations = Restaurants.map(d => d.address)
			for (i = 0; i < locations.length; i++) {
				duration = await googleMapsClient.directions({
					origin: origin,
					destination: locations[i]
				}).asPromise()
					.then((response) => {
						return response.json.routes[0].legs[0].duration.text
					})
					.catch((err) => {
						console.log(err);
					})
				Restaurants[i].duration = duration
			}
			const Attractions = user.FavoritedAttractions.map(r => ({
				...r.dataValues,
				name: r.dataValues.name.substring(0, 7),
				isSelected: user.ComponentAttractions.map(d => d.id).includes(r.id) ? true : false,
				introduction: r.dataValues.introduction.substring(0, 10),
				ratingStars: (Math.round((r.rating / 5) * 100)) + '%',
				opening_hours: r.opening_hours.substring(0, 10),
				status: currentTime > JSON.parse("[" + r.dataValues.opening_up + "]") && currentTime <
					JSON.parse("[" + r.dataValues.opening_down + "]") ? '營業中' :
					Math.abs(JSON.parse("[" + r.dataValues.opening_up + "]") - currentTime) < 0.5 && (JSON.parse("[" + r.dataValues.opening_up + "]") - currentTime) > 0 ? '即將營業' :
						Math.abs(JSON.parse("[" + r.dataValues.opening_down + "]") - currentTime) < 1 && (JSON.parse("[" + r.dataValues.opening_down + "]") - currentTime) > 0 ? '即將結束營業' :
							'休息中'
			}))
			locations = Attractions.map(d => d.address)
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
				opening_hours: r.opening_hours.substring(0, 10),
				status: currentTime > JSON.parse("[" + r.dataValues.opening_up + "]") && currentTime <
					JSON.parse("[" + r.dataValues.opening_down + "]") ? '營業中' :
					Math.abs(JSON.parse("[" + r.dataValues.opening_up + "]") - currentTime) < 0.5 && (JSON.parse("[" + r.dataValues.opening_up + "]") - currentTime) > 0 ? '即將營業' :
						Math.abs(JSON.parse("[" + r.dataValues.opening_down + "]") - currentTime) < 1 && (JSON.parse("[" + r.dataValues.opening_down + "]") - currentTime) > 0 ? '即將結束營業' :
							'休息中'
			}))
			locations = Shops.map(d => d.address)
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
			return res.render('favorite', {
				attractions: Attractions,
				restaurants: Restaurants,
				shops: Shops,
				favoriteArray: favoriteArray

			})
		} catch (err) { console.log(err) }

	},
	addFavoriteRest: (req, res) => {
		return Favorite.create({
			UserId: req.user.id,
			RestaurantId: req.params.rest_id,
		}).then((favorite) => {
			req.flash('success_msg', '已成功收藏!')
			return res.redirect('back')
		})
	},
	removeFavoriteRest: (req, res) => {
		return Favorite.findOne({
			UserId: req.user.id,
			RestaurantId: req.params.rest_id,
		}).then((favorite) => {
			favorite.destroy()
			req.flash('success_msg', '已成功取消收藏!')
			return res.redirect('back')
		})
	},
	addFavoriteAttraction: (req, res) => {
		return Favorite.create({
			UserId: req.user.id,
			AttractionId: req.params.attraction_id,
		}).then((favorite) => {
			req.flash('success_msg', '已成功收藏!')
			return res.redirect('back')
		})
	},
	removeFavoriteAttraction: (req, res) => {
		return Favorite.findOne({
			UserId: req.user.id,
			AttractionId: req.params.attraction_id,
		}).then((favorite) => {
			favorite.destroy()
			req.flash('success_msg', '已成功取消收藏!')
			return res.redirect('back')
		})
	},
	addFavoriteShop: (req, res) => {
		return Favorite.create({
			UserId: req.user.id,
			ShopId: req.params.shop_id,
		}).then((favorite) => {
			req.flash('success_msg', '已成功收藏!')
			return res.redirect('back')
		})
	},
	removeFavoriteShop: (req, res) => {
		return Favorite.findOne({
			UserId: req.user.id,
			ShopId: req.params.shop_id,
		}).then((favorite) => {
			favorite.destroy()
			req.flash('success_msg', '已成功取消收藏!')
			return res.redirect('back')
		})
	},
	addRestComponent: (req, res) => {
		return Component.create({
			UserId: req.user.id,
			RestaurantId: req.params.rest_id
		}).then((component) => {
			req.flash('success_msg', '已成功加入規劃!')
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
			req.flash('success_msg', '已成功取消規劃!')
			return res.redirect('back')
		})
	},
	putRestComponent: (req, res) => {
		return Component.findOne({
			where: {
				UserId: req.user.id,
				RestaurantId: req.params.rest_id
			}
		}).then((component) => {
			component.update({
				stayTime: req.body.stayTime
			})
			req.flash('success_msg', '已成功修改停留時間!')
			return res.redirect(`/users/${req.user.id}/dailyTour`)
		})
	},
	addAttractionComponent: (req, res) => {
		return Component.create({
			UserId: req.user.id,
			AttractionId: req.params.attraction_id,
		}).then((component) => {
			req.flash('success_msg', '已成功加入規劃!')
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
			req.flash('success_msg', '已成功取消規劃!')
			return res.redirect(`/users/${req.user.id}/dailyTour`)
		})

	},
	putAttractionComponent: (req, res) => {
		return Component.findOne({
			where: {
				UserId: req.user.id,
				AttractionId: req.params.attraction_id
			}
		}).then((component) => {
			component.update({
				stayTime: req.body.stayTime
			})
			req.flash('success_msg', '已成功修改停留時間!')
			return res.redirect('back')
		})
	},
	addShopComponent: (req, res) => {
		return Component.create({
			UserId: req.user.id,
			ShopId: req.params.shop_id,
		}).then((component) => {
			req.flash('success_msg', '已成功加入規劃!')
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
			req.flash('success_msg', '已成功取消規劃!')
			return res.redirect('back')
		})

	},
	putShopComponent: (req, res) => {
		return Component.findOne({
			where: {
				UserId: req.user.id,
				ShopId: req.params.shop_id
			}
		}).then((component) => {
			component.update({
				stayTime: req.body.stayTime
			})
			req.flash('success_msg', '已成功修改停留時間!')
			return res.redirect(`/users/${req.user.id}/dailyTour`)
		})
	},
	removeAllComponents: (req, res) => {
		return Component.findAll({
			where: {
				UserId: req.user.id
			}
		}).then(components => {
			components.map(d => d.destroy())
			req.flash('success_msg', '已清空!')
			return res.redirect('back')
		})
	}
	// getDaysTour: (req, res) => {
	// 	return res.render('daysTour')
	// },
	// postBlog: (req, res) => {
	// 	return res.redirect('/tours/blog/:tour_id')
	// },
	// getBlog: (req, res) => {
	// 	return res.render('blog')
	// },
	// getBlogEdit: (req, res) => {
	// 	return res.render('blogEdit')
	// },
	// getShare: (req, res) => {
	// 	return res.render('share')
	// },
	// postShare: (req, res) => {
	// 	return res.redirect('back')
	// }


}

module.exports = userController
