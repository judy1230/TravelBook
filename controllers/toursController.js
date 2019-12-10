const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
const Attraction = db.Attraction
const Tour = db.Tour
const Blog = db.Blog
const Favorite = db.Favorite
const Like = db.Like
const Comment = db.Comment
const Location = db.Location
//const pageLimit = 20
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
		return res.render('restaurants')
	},
	getRestaurant: (req, res) => {
		return res.render('restaurant')
	},
	getAttractions: (req, res) => {
		return res.render('attractions')
	},
	getAttraction: (req, res) => {
		return res.render('attraction')
	},


}



module.exports = toursController
