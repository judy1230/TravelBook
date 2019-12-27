const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
const Attraction = db.Attraction
const Shopping = db.Shopping
const Favorite = db.Favorite
const Tour = db.Tour
const Blog = db.Blog
const Like = db.Like
const Comment = db.Comment
const Location = db.Location
const pageLimit = 10
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
		let offset = 0
		let whereQuery = {}
		return Restaurant.findAndCountAll({
			order: [
				['updatedAt', 'DESC']
			],
			include: [
				//{ model: User, as: 'FavoritedUsers' },
				Comment
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
		return res.render('restaurant')
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
		return res.render('attraction')
	},
	getShoppings: (req, res) => {
		let offset = 0
		let whereQuery = {}
		return Shopping.findAll({
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
				return res.render('shopping', {
					shoppings: data,
					page: page,
					totalPage: totalPage,
					prev: prev,
					next: next,
				})
			})

	},
	getShopping: (req, res) => {

	},

}



module.exports = toursController
