const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
const Attraction = db.Attraction
const Shop = db.Shop
const Favorite = db.Favorite
const Tour = db.Tour
const Blog = db.Blog
const Like = db.Like
const Comment = db.Comment
const Photos = db.Photos
const Location = db.Location
const pageLimit = 4
//const Sequelize = require('sequelize')
const currentTime = new Date().getHours() + new Date().getMinutes() / 60
//const helpersreq = require('../_helpers.js')


const toursController = {
	// go to index
	getIndex: async (req, res) => {
		try {
			restaurants = await Restaurant.findAll({
				order: [
					['updatedAt', 'DESC']
				],
				include: [
					{ model: User, as: 'FavoritedUsers' }
				],
			}).then(restaurants => {
				const data = restaurants.map(r => ({
					...r.dataValues,
					name: r.dataValues.name.substring(0, 7),
					ratingStars: (Math.round((r.rating / 5) * 100)) + '%',
					status: currentTime > JSON.parse("[" + r.dataValues.opening_up + "]") && currentTime <
						JSON.parse("[" + r.dataValues.opening_down + "]") ? '營業中' :
						Math.abs(JSON.parse("[" + r.dataValues.opening_up + "]") - currentTime) < 0.5 && (JSON.parse("[" + r.dataValues.opening_up + "]") - currentTime) > 0 ? '即將營業' :
							Math.abs(JSON.parse("[" + r.dataValues.opening_down + "]") - currentTime) < 1 && (JSON.parse("[" + r.dataValues.opening_down + "]") - currentTime) > 0 ? '即將結束營業' :
								'休息中'
				}))

				return data
			})
			attractions = await Attraction.findAll({
				order: [
					['updatedAt', 'DESC']
				],
				include: [
					{ model: User, as: 'FavoritedUsers' }
				],
			}).then(attractions => {
				const data = attractions.map(r => ({
					...r.dataValues,
					name: r.dataValues.name.substring(0, 7),
					ratingStars: (Math.round((r.rating / 5) * 100)) + '%',
					status: currentTime > JSON.parse("[" + r.dataValues.opening_up + "]") && currentTime <
						JSON.parse("[" + r.dataValues.opening_down + "]") ? '營業中' :
						Math.abs(JSON.parse("[" + r.dataValues.opening_up + "]") - currentTime) < 0.5 && (JSON.parse("[" + r.dataValues.opening_up + "]") - currentTime) > 0 ? '即將營業' :
							Math.abs(JSON.parse("[" + r.dataValues.opening_down + "]") - currentTime) < 1 && (JSON.parse("[" + r.dataValues.opening_down + "]") - currentTime) > 0 ? '即將結束營業' :
								'休息中'
				}))
				return data
			})
			shops = await Shop.findAll({
				order: [
					['updatedAt', 'DESC']
				],
				include: [
					{ model: User, as: 'FavoritedUsers' }
				],
			}).then(shops => {
				const data = shops.map(r => ({
					...r.dataValues,
					name: r.dataValues.name.substring(0, 10),
					ratingStars: (Math.round((r.rating / 5) * 100)) + '%',
					status: currentTime > JSON.parse("[" + r.dataValues.opening_up + "]") && currentTime <
						JSON.parse("[" + r.dataValues.opening_down + "]") ? '營業中' :
						Math.abs(JSON.parse("[" + r.dataValues.opening_up + "]") - currentTime) < 0.5 && (JSON.parse("[" + r.dataValues.opening_up + "]") - currentTime) > 0 ? '即將營業' :
							Math.abs(JSON.parse("[" + r.dataValues.opening_down + "]") - currentTime) < 1 && (JSON.parse("[" + r.dataValues.opening_down + "]") - currentTime) > 0 ? '即將結束營業' :
								'休息中'
				}))
				return data
			})
			return res.render('index', {
				restaurants, attractions, shops
			})
		} catch (err) { console.log(err) }
	},
	getRestaurants: (req, res) => {
		//console.log('req.user', req.user.Tours[0].dataValues.id)
		return Restaurant.findAndCountAll({
			order: [
				['updatedAt', 'DESC']
			],
			include: [
				{ model: User, as: 'FavoritedUsers' },
				{ model: User, as: 'ComponentUsers' },
				Comment
			],
		})
			.then(result => {
				const data = result.rows.map(r => ({
					...r.dataValues,
					name: r.dataValues.name.substring(0, 7),
					//introduction: r.dataValues.introduction.substring(0, 20),
					isFavorited: req.user ? r.dataValues.FavoritedUsers.map(d => d.id).includes(req.user.id) : false,
					isSelected: req.user ? r.dataValues.ComponentUsers.map(d => d.id).includes(req.user.id) :false,
					ratingStars: (Math.round((r.rating / 5) * 100)) + '%',
					status: currentTime > JSON.parse("[" + r.dataValues.opening_up + "]") && currentTime <
						JSON.parse("[" + r.dataValues.opening_down + "]") ? '營業中' :
						Math.abs(JSON.parse("[" + r.dataValues.opening_up + "]") - currentTime) < 0.5 && (JSON.parse("[" + r.dataValues.opening_up + "]") - currentTime) > 0 ? '即將營業' :
							Math.abs(JSON.parse("[" + r.dataValues.opening_down + "]") - currentTime) < 1 && (JSON.parse("[" + r.dataValues.opening_down + "]") - currentTime) > 0 ? '即將結束營業' :
								'休息中'
				}))
				return res.render('restaurants', {
					restaurants: data
				})
			})

	},
	getRestaurant: (req, res) => {

		return Restaurant.findByPk(req.params.restaurant_id, {
			include: [
				{ model: User, as: 'FavoritedUsers' },
				{ model: User, as: 'ComponentUsers' },
				{ model: User, as: 'LikedUsers' },
				{ model: Comment, include: [User] },
				Photos
			]
		}).then(restaurant => {
			totalViewCounts = parseInt(restaurant.viewCounts) + 1
			restaurant.update({
				viewCounts: totalViewCounts
			})
			const isFavorited = req.user ? restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id) : false
			const isSelected = req.user ? restaurant.ComponentUsers.map(d => d.id).includes(req.user.id) : false
			const status = currentTime > JSON.parse("[" + restaurant.opening_up + "]") && currentTime <
				JSON.parse("[" + restaurant.opening_down + "]") ? '營業中' :
				Math.abs(JSON.parse("[" + restaurant.opening_up + "]") - currentTime) < 0.5 && (JSON.parse("[" + restaurant.opening_up + "]") - currentTime) > 0 ? '即將營業' :
					Math.abs(JSON.parse("[" + restaurant.opening_down + "]") - currentTime) < 1 && (JSON.parse("[" + restaurant.opening_down + "]") - currentTime) > 0 ? '即將結束營業' :
						'休息中'
			const isAdmin = req.user ? req.user.role === 'admin' : false
			return res.render('restaurant', {
				restaurant,
				isFavorited,
				isSelected,
				status,
				isAdmin
			})
		})
	},
	getAttractions: (req, res) => {
		return Attraction.findAndCountAll({
			order: [
				['updatedAt', 'DESC']
			],
			include: [
				{ model: User, as: 'FavoritedUsers' },
				{ model: User, as: 'ComponentUsers' },
			]
		})
			.then(result => {
				const data = result.rows.map(r => ({
					...r.dataValues,
					name: r.dataValues.name.substring(0, 7),
					//introduction: r.dataValues.introduction.substring(0, 10),
					isFavorited: req.user ? r.dataValues.FavoritedUsers.map(d => d.id).includes(req.user.id) : false,
					isSelected: req.user ? r.dataValues.ComponentUsers.map(d => d.id).includes(req.user.id) : false,
					ratingStars: (Math.round((r.rating / 5) * 100)) + '%',
					status: currentTime > JSON.parse("[" + r.dataValues.opening_up + "]") && currentTime <
						JSON.parse("[" + r.dataValues.opening_down + "]") ? '營業中' :
						Math.abs(JSON.parse("[" + r.dataValues.opening_up + "]") - currentTime) < 0.5 && (JSON.parse("[" + r.dataValues.opening_up + "]") - currentTime) > 0 ? '即將營業' :
							Math.abs(JSON.parse("[" + r.dataValues.opening_down + "]") - currentTime) < 1 && (JSON.parse("[" + r.dataValues.opening_down + "]") - currentTime) > 0 ? '即將結束營業' :
								'休息中'
				}))

				return res.render('attractions', {
					attractions: data
				})
			})

	},
	getAttraction: (req, res) => {
		return Attraction.findByPk(req.params.attraction_id, {
			include: [
				{ model: User, as: 'FavoritedUsers' },
				{ model: User, as: 'ComponentUsers' },
				{ model: User, as: 'LikedUsers' },
				{ model: Comment, include: [User] },
				Photos
			]
		}).then(attraction => {
			totalViewCounts = parseInt(attraction.viewCounts) + 1
			attraction.update({
				viewCounts: totalViewCounts
			})
			const isFavorited = req.user ? attraction.FavoritedUsers.map(d => d.id).includes(req.user.id) : false
			const isSelected = req.user ? attraction.ComponentUsers.map(d => d.id).includes(req.user.id) : false
			const status = currentTime > JSON.parse("[" + attraction.opening_up + "]") && currentTime <
				JSON.parse("[" + attraction.opening_down + "]") ? '營業中' :
				Math.abs(JSON.parse("[" + attraction.opening_up + "]") - currentTime) < 0.5 && (JSON.parse("[" + attraction.opening_up + "]") - currentTime) > 0 ? '即將營業' :
					Math.abs(JSON.parse("[" + attraction.opening_down + "]") - currentTime) < 1 && (JSON.parse("[" + attraction.opening_down + "]") - currentTime) > 0 ? '即將結束營業' :
						'休息中'
			const isAdmin = req.user ? req.user.role === 'admin' : false
			return res.render('attraction', {
				attraction,
				isFavorited,
				isSelected,
				isAdmin,
				status
			})
		})

	},
	getShops: (req, res) => {
		return Shop.findAndCountAll({
			order: [
				['updatedAt', 'DESC']
			],
			include: [
				{ model: User, as: 'FavoritedUsers' },
				{ model: User, as: 'ComponentUsers' }
			]
		}).then(result => {
			const data = result.rows.map(r => ({
				...r.dataValues,
				name: r.dataValues.name.substring(0, 10),
				isFavorited: req.user ? r.dataValues.FavoritedUsers.map(d => d.id).includes(req.user.id) : false,
				isSelected: req.user ? r.dataValues.ComponentUsers.map(d => d.id).includes(req.user.id) : false,
				ratingStars: (Math.round((r.rating / 5) * 100)) + '%',
				status: currentTime > JSON.parse("[" + r.dataValues.opening_up + "]") && currentTime <
					JSON.parse("[" + r.dataValues.opening_down + "]") ? '營業中' :
					Math.abs(JSON.parse("[" + r.dataValues.opening_up + "]") - currentTime) < 0.5 && (JSON.parse("[" + r.dataValues.opening_up + "]") - currentTime) > 0 ? '即將營業' :
						Math.abs(JSON.parse("[" + r.dataValues.opening_down + "]") - currentTime) < 1 && (JSON.parse("[" + r.dataValues.opening_down + "]") - currentTime) > 0 ? '即將結束營業' :
							'休息中'
			}))
			return res.render('shops', {
				shops: data
			})
		})

	},
	getShop: (req, res) => {
		return Shop.findByPk(req.params.shop_id, {
			include: [
				{ model: User, as: 'FavoritedUsers' },
				{ model: User, as: 'ComponentUsers' },
				{ model: User, as: 'LikedUsers' },
				{ model: Comment, include: [User] },
				Photos
			]
		}).then(shop => {

			totalViewCounts = parseInt(shop.viewCounts) + 1
			shop.update({
				viewCounts: totalViewCounts
			})
			const isFavorited = req.user ? shop.FavoritedUsers.map(d => d.id).includes(req.user.id) : false
			const isSelected = req.user ? shop.ComponentUsers.map(d => d.id).includes(req.user.id) : false
			const isAdmin = req.user ? req.user.role === 'admin' : false
			const status = currentTime > JSON.parse("[" + shop.opening_up + "]") && currentTime <
				JSON.parse("[" + shop.opening_down + "]") ? '營業中' :
				Math.abs(JSON.parse("[" + shop.opening_up + "]") - currentTime) < 0.5 && (JSON.parse("[" + shop.opening_up + "]") - currentTime) > 0 ? '即將營業' :
					Math.abs(JSON.parse("[" + shop.opening_down + "]") - currentTime) < 1 && (JSON.parse("[" + shop.opening_down + "]") - currentTime) > 0 ? '即將結束營業' :
						'休息中'
			return res.render('shop', {
				shop,
				isFavorited,
				isSelected,
				isAdmin,
				status
			})
		})
	},
	addFavoriteRest: (req, res) => {
		return Favorite.create({
			UserId: req.user.id,
			RestaurantId: req.params.rest_id,
		}).then((favorite) => {
			return res.redirect('back')
		})
	},
	removeFavoriteRest: (req, res) => {
		return Favorite.findOne({
			UserId: req.user.id,
			RestaurantId: req.params.rest_id,
		}).then((favorite) => {
			favorite.destroy()
			return res.redirect('back')
		})
	},
	addFavoriteAttraction: (req, res) => {
		return Favorite.create({
			UserId: req.user.id,
			AttractionId: req.params.attraction_id,
		}).then((favorite) => {
			return res.redirect('back')
		})
	},
	removeFavoriteAttraction: (req, res) => {
		return Favorite.findOne({
			UserId: req.user.id,
			AttractionId: req.params.attraction_id,
		}).then((favorite) => {
			favorite.destroy()
			return res.redirect('back')
		})
	},
	addFavoriteShop: (req, res) => {
		return Favorite.create({
			UserId: req.user.id,
			ShopId: req.params.shop_id,
		}).then((favorite) => {
			return res.redirect('back')
		})
	},
	removeFavoriteShop: (req, res) => {
		console.log('//////////////helllo remove shop////////')
		return Favorite.findOne({
			UserId: req.user.id,
			ShopId: req.params.shop_id,
		}).then((favorite) => {
			favorite.destroy()
			return res.redirect('back')
		})
	},

}



module.exports = toursController
