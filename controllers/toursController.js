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
const Location = db.Location
const pageLimit = 4
// const Followship = db.Followship
const helpersreq = require('../_helpers.js')


const toursController = {
	// go to index
	getTours: (req, res) => {
		return res.render('index')
	},
	getDailyTours: (req, res) => {
		return res.render('dailyTours')
	},
	getDaysTours: (req, res) => {
		return res.render('daysTours')
	},
	getDailyTour: (req, res) => {
		return res.render('dailyTour')
	},
	getDaysTour: (req, res) => {
		return res.render('daysTour')
	},
	getBlogs: (req, res) => {
		return res.render('blogs')
	},
	getBlog: (req, res) => {
		return res.render('blog')
	},
	getBlogEdit: (req, res) => {
		return res.render('blogedit')
	},
	postBlog: (req, res) => {
		return res.redirect('/tours/blog/:tour_id')
	},
	getRestaurants: (req, res) => {
		console.log('req.user',req.user)
		let offset = 0
		let whereQuery = {}
		return Restaurant.findAndCountAll({
			order: [
				['updatedAt', 'DESC']
			],
			include: [
				{ model: User, as: 'FavoritedUsers' },
				Comment
			],
			where: whereQuery, offset: offset, limit: pageLimit
		})
			.then(result => {
				//console.log('result', result.Favorites)
				let page = Number(req.query.page) || 1
				let pages = Math.ceil(result.count / pageLimit)
				let totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
				let prev = page - 1 < 1 ? 1 : page - 1
				let next = page + 1 > pages ? pages : page + 1
				//clean up restaurant data
				const data = result.rows.map(r => ({
					...r.dataValues,
					introduction: r.dataValues.introduction.substring(0, 20),
					isFavorited : r.dataValues.FavoritedUsers.map(d => d.id).includes(req.user.id)
				}))
				//return { data, page, pages, totalPage, prev, next }
				console.log('data', data)
				return res.render('restaurants', {
					restaurants: data,
					page: page,
					totalPage: totalPage,
					prev: prev,
					next: next,
				})
			})

	},
	getRestaurant: (req, res) => {
		req.user = User.findByPk('1')
		console.log('req.user.id', req.user.id)
		return Restaurant.findByPk(req.params.restaurant_id, {
			include: [
				//Category,
				{ model: User, as: 'FavoritedUsers' },
				//{ model: User, as: 'LikedUsers' },
				{ model: Comment, include: [User] }
			]
		}).then(restaurant => {
			console.log('restaurant',restaurant)
			totalViewCounts = parseInt(restaurant.viewCounts) + 1
			restaurant.update({
				viewCounts: totalViewCounts
			})
			const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id)
			//const isLiked = restaurant.LikedUsers.map(d => d.id).includes(req.user.id)
			return res.render('restaurant', {
				restaurant,
				isFavorited: isFavorited,
				//isLiked: isLiked
			})
		})

	},
	getAttractions: (req, res) => {
		let offset = 0
		let whereQuery = {}
		return Attraction.findAndCountAll({
			order: [
				['updatedAt', 'DESC']
			],
			where: whereQuery, offset: offset, limit: pageLimit
		})
			.then(result => {
				let page = Number(req.query.page) || 1
				let pages = Math.ceil(result.count / pageLimit)
				let totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
				let prev = page - 1 < 1 ? 1 : page - 1
				let next = page + 1 > pages ? pages : page + 1
				//clean up restaurant data
				const data = result.rows.map(r => ({
					...r.dataValues,
					introduction: r.dataValues.introduction.substring(0, 10)
				}))
				return res.render('attractions', {
					attractions: data,
					page: page,
					totalPage: totalPage,
					prev: prev,
					next: next,
				})
			})

	},
	getAttraction: (req, res) => {
		return Attraction.findByPk(req.params.attraction_id, {
			include: [
				{ model: Comment, include: [User] }
			]
		}).then(attraction => {

			totalViewCounts = parseInt(attraction.viewCounts) + 1
			attraction.update({
				viewCounts: totalViewCounts
			})
			return res.render('attraction', {
				attraction
			})
		})

	},
	getShops: (req, res) => {
		let offset = 0
		let whereQuery = {}
		return Shop.findAndCountAll({
			order: [
				['updatedAt', 'DESC']
			],
			where: whereQuery, offset: offset, limit: pageLimit
		})
			.then(result => {
				let page = Number(req.query.page) || 1
				let pages = Math.ceil(result.count / pageLimit)
				let totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
				let prev = page - 1 < 1 ? 1 : page - 1
				let next = page + 1 > pages ? pages : page + 1
				//clean up restaurant data
				const data = result.rows.map(r => ({
					...r.dataValues,
					introduction: r.dataValues.introduction.substring(0, 10)
				}))
				//return { data, page, pages, totalPage, prev, next }
				console.log('data', data)
				return res.render('shops', {
					shops: data,
					page: page,
					totalPage: totalPage,
					prev: prev,
					next: next,
				})
			})

	},
	getShop: (req, res) => {
		return Shop.findByPk(req.params.shop_id, {
			include: [
				{ model: Comment, include: [User] }
			]
		}).then(shop => {

			totalViewCounts = parseInt(shop.viewCounts) + 1
			shop.update({
				viewCounts: totalViewCounts
			})
			return res.render('shop', {
				shop
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
		console.log('//////////////helllo remove////////')
		return Favorite.findOne({
			UserId: req.user.id,//req.user.id
			RestaurantId: req.params.rest_id,
		}).then((favorite) => {
			favorite.destroy()
			return res.redirect('back')
		})
	}

}



module.exports = toursController
